import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import de useNavigate
import { setBreadcrumb } from '@/redux/slices/breadcrumbSlice';
import { TicketService } from '@/api/ticket.api';
import { Badge } from '@/components/ui/badge';
import * as Kanban from '@/components/ui/kanban';
import { useTranslation } from 'react-i18next';

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
    const navigate = useNavigate(); // On initialise useNavigate

    const COLUMN_TITLES: Record<string, string> = {
        pending: t("pages.ticket.colonnes.pending"),
        inProgress: t("pages.ticket.colonnes.inProgress"),
        done: t("pages.ticket.colonnes.done"),
    };

    useEffect(() => {
        dispatch(setBreadcrumb({
            segments: ['Accueil', "Ticket"],
            links: ['/office/dashboard'],
        }));
    }, [dispatch]);

    const { tickets, loading, error } = useTickets();
    const [columns, setColumns] = useState<Record<string, Ticket[]>>({
        pending: [],
        inProgress: [],
        done: [],
    });

    useEffect(() => {
        const categorizedTickets = {
            pending: tickets.filter(ticket => ticket.state === 'Pending'),
            inProgress: tickets.filter(ticket => ticket.state === 'In Progress'),
            done: tickets.filter(ticket => ticket.state === 'Done'),
        };
        setColumns(categorizedTickets);
    }, [tickets]);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>Erreur: {error}</p>;

    return (
        <div className="w-full">
            <Kanban.Root
                value={columns}
                onValueChange={setColumns}
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
                                    {COLUMN_TITLES[columnValue]}
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
                // Redirection rapide vers l'URL du ticket
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
                        {ticket.priority}
                    </Badge>
                </div>
                {ticket.adminAttribute && (
                    <div className="text-xs text-muted-foreground">
                        {t("pages.ticket.assigne")} {ticket.adminAttribute.first_name} {ticket.adminAttribute.last_name}
                    </div>
                )}
                <div className="text-xs text-muted-foreground">
                    {ticket.description}
                </div>
            </div>
        </div>
    );

    return renderTicketContent();
};

export default TicketBoard;
