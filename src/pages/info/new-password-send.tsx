import React from 'react';
import auth1 from '@/assets/illustrations/auth1.svg';

const NewPasswordSend: React.FC = () => {

    return (
        <div className="flex flex-col items-center justify-center h-screen text-center px-4">
            <h1 className="text-4xl font-bold">Un email vous a été envoyé</h1>
            <img
                src={auth1}
                alt="Illustration"
                className="w-72 my-5"
            />
            <p className="text-lg">
                Veuillez vérifier votre boîte de réception pour réinitialiser votre mot de passe.
            </p>
        </div>
    );
};

export default NewPasswordSend;
