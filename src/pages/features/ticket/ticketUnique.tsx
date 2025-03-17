import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";


export default function TicketUnique() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    // Récupérer dans l'url l'id du ticket
    const { id } = useParams();

    if (!id) {
        navigate('/office/ticket');
    }

        useEffect(() => {
            dispatch(setBreadcrumb({
                segments: ['Accueil', "Ticket", id || 'unknown'],
                links: ['/office/dashboard', 'office/ticket'],
            }));
        }, [dispatch]);


        return (
            <div>
                
            </div>
        )


    }


        