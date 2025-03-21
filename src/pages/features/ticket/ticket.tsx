import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setBreadcrumb } from '@/redux/slices/breadcrumbSlice';
import { TicketService } from '@/api/ticket.api';
import { Badge } from '@/components/ui/badge';
import * as Kanban from '@/components/ui/kanban';
import { useTranslation } from 'react-i18next';
import { RootState } from '@/redux/store';
import { Button } from '@/components/ui/button';

export interface Admin {
    last_name: string;
    first_name: string;
    photo: string;
}

export interface Ticket {
    ticket_id?: string;
    status: string;
    state?: string;
    description: string;
    title: string;
    priority: string;
    adminAttribute?: Admin;
}

const useTickets = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const data = await TicketService.getTickets();
                setTickets(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    return { tickets, loading, error };
};

const TicketBoard: React.FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const COLUMN_TITLES: Record<string, string> = {
        pending: t("pages.ticket.colonnes.pending"),
        inProgress: t("pages.ticket.colonnes.inProgress"),
        done: t("pages.ticket.colonnes.done"),
    };

    useEffect(() => {
        dispatch(setBreadcrumb({
            segments: [t("pages.ticket.breadcrumb.accueil"), t("pages.ticket.breadcrumb.ticket")],
            links: ['/office/dashboard'],
        }));
    }, [dispatch]);

    const admin = useSelector((state: RootState & { admin: { admin: any } }) => state.admin.admin);

    const isTicketManager = admin?.roles.includes('TICKET');

    const { tickets, loading, error } = useTickets();
    const [columns, setColumns] = useState<Record<string, Ticket[]>>({
        pending: [],
        inProgress: [],
        done: [],
    });

    useEffect(() => {
        const categorizedTickets = {
            pending: tickets.filter(ticket => ticket.state === 'Pending'),
            inProgress: tickets.filter(ticket => ticket.state === 'Progress'),
            done: tickets.filter(ticket => ticket.state === 'Done'),
        };
        setColumns(categorizedTickets);
    }, [tickets]);

    const handleColumnChange = async (newColumns: Record<string, Ticket[]>) => {
        const movedTicket = findMovedTicket(columns, newColumns);

        if (movedTicket) {
            const newState = Object.keys(newColumns).find(column =>
                newColumns[column].some(ticket => ticket.ticket_id === movedTicket.ticket_id)
            ) as keyof typeof COLUMN_TITLES;

            if (newState && newState !== movedTicket.state) {
                const stateMapping: Record<keyof typeof COLUMN_TITLES, string> = {
                    pending: 'Pending',
                    inProgress: 'Progress',
                    done: 'Done'
                };

                await TicketService.updateTicket(movedTicket.ticket_id!, { state: stateMapping[newState] });
            }
        }

        setColumns(newColumns);
    };

    const findMovedTicket = (oldColumns: Record<string, Ticket[]>, newColumns: Record<string, Ticket[]>) => {
        for (const column in oldColumns) {
            const oldTickets = oldColumns[column];
            const newTickets = newColumns[column];

            const removedTicket = oldTickets.find(ticket =>
                !newTickets.some(newTicket => newTicket.ticket_id === ticket.ticket_id)
            );

            if (removedTicket) {
                return removedTicket;
            }
        }
        return null;
    };

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>Erreur: {error}</p>;

    return (
        <div className="w-full">
            <h1 className="text-2xl font-semibold mb-4">
                {t("pages.ticket.titre")}
            </h1>

            {isTicketManager && (
                <><Button onClick={() => navigate("/office/ticket/create")} className='mb-4'>{t("pages.ticket.action")}</Button></>
            )

            }
            <Kanban.Root
                value={columns}
                onValueChange={handleColumnChange}
                getItemValue={(item) => item.ticket_id || ''}
                autoScroll={false}
            >
                <Kanban.Board className="grid auto-rows-fr sm:grid-cols-3 gap-4 w-full max-w-screen-xl mx-auto">
                    {Object.entries(columns).map(([columnValue, tickets]) => (
                        <Kanban.Column
                            key={columnValue}
                            value={columnValue}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-sm">
                                    {COLUMN_TITLES[columnValue as keyof typeof COLUMN_TITLES]}
                                </span>
                                <Badge variant="secondary" className="rounded-sm">
                                    {tickets.length}
                                </Badge>
                            </div>
                            <div className="flex flex-col gap-2 p-0.5 max-w">
                                {tickets.map(ticket => (
                                    <Kanban.Item key={ticket.ticket_id} value={ticket.ticket_id || ''} asHandle>
                                        <TicketItem ticket={ticket} readOnly={false} navigate={navigate} />
                                    </Kanban.Item>
                                ))}
                            </div>
                        </Kanban.Column>
                    ))}
                </Kanban.Board>
            </Kanban.Root>
        </div>
    );
};

interface TicketItemProps {
    ticket: Ticket;
    readOnly: boolean;
    navigate: ReturnType<typeof useNavigate>;
}

const TicketItem: React.FC<TicketItemProps> = ({ ticket, navigate }) => {
    const [isDragging, setIsDragging] = useState(false);
    const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const CLICK_THRESHOLD = 500;

    const { t } = useTranslation();

    const handleMouseDown = () => {
        clickTimeoutRef.current = setTimeout(() => {
            setIsDragging(true);
        }, CLICK_THRESHOLD);
    };

    const handleMouseUp = () => {
        if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current);
            if (!isDragging) {
                if (ticket.ticket_id) {
                    navigate(`/office/ticket/${ticket.ticket_id}`);
                }
            }
        }
        setIsDragging(false);
    };

    const renderTicketContent = () => (
        <div
            className="rounded-md border bg-card p-3 shadow-xs cursor-pointer"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm">
                        {ticket.title}
                    </span>
                    <Badge
                        variant={
                            ticket.priority === 'High' ? 'destructive' :
                            ticket.priority === 'Medium' ? 'default' : 'secondary'
                        }
                        className="h-5 rounded-sm px-1.5 text-[11px] capitalize"
                    >
                        {ticket.priority === 'High' ? t("pages.ticket.priorite.haute") :
                            ticket.priority === 'Medium' ? t("pages.ticket.priorite.moyenne") : t("pages.ticket.priorite.basse")}
                    </Badge>
                </div>
                {ticket.adminAttribute && (
                    <div className="text-xs text-muted-foreground">
                        {t("pages.ticket.assigne")} {ticket.adminAttribute.first_name} {ticket.adminAttribute.last_name}
                    </div>
                )}
            </div>
        </div>
    );

    return renderTicketContent();
};

export default TicketBoard;
