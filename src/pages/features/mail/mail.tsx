import { useEffect, useState } from "react";
import { EmailDataTable } from "@/components/features/mail/data-table";
import { PaginationControls } from "@/components/pagination-controle";
import { useDispatch, useSelector } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { Mail, MailService } from "@/api/mail.api";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/redux/store";

export default function EmailPage() {
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [emails, setEmails] = useState<Mail[]>([]);
    const [totalEmails, setTotalEmails] = useState(0);


    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(
            setBreadcrumb({
                segments: ["Accueil", "Mails"],
                links: ["/office/dashboard"],
            })
        );
    }, [dispatch]);

        const admin = useSelector((state: RootState & { admin: { admin: any } }) => state.admin.admin);
    
        const isTicketManager = admin?.roles.includes('MAIL');

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const response = await MailService.getAllMail(pageIndex, pageSize);
                setEmails(response.data);
                setTotalEmails(response.meta.total);
            } catch (error) {
                console.error("Erreur lors de la récupération des mails", error);
            }
        };

        fetchEmails();
    }, [pageIndex, pageSize]);

    const navigate = useNavigate();

    return (
        <>
        <div className="w-full">
        <h1 className="text-2xl font-semibold mb-4">Mail</h1>
                    {isTicketManager && (
                        <><Button onClick={() => navigate("/office/mail/create")} className='mb-4'>Rédiger un mail</Button></>
                    )}
            <EmailDataTable key={`${pageIndex}-${pageSize}`} data={emails} />
            <PaginationControls
                pageIndex={pageIndex}
                pageSize={pageSize}
                totalItems={totalEmails}
                onPageIndexChange={setPageIndex}
                onPageSizeChange={(size) => {
                    setPageSize(size);
                    setPageIndex(0);
                }}
            />
            </div>
        </>
    );
}