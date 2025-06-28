import React from 'react';
import mail from '@/assets/illustrations/mail.svg';
import { useTranslation } from 'react-i18next';

const NewPasswordSend: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center h-screen text-center px-4">
            <h1 className="text-4xl font-bold">{t("pages.newPasswordSent.title")}</h1>
            <img
                src={mail}
                alt="Illustration"
                className="w-72 my-5"
            />
            <p className="text-lg">
                {t("pages.newPasswordSent.description")}
            </p>
        </div>
    );
};

export default NewPasswordSend;
