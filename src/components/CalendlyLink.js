import React, { useEffect, useState } from "react";
import Button from "./Button";
import styles from '../styles/CalendlyLink.module.css';

const CalendlyLink = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://assets.calendly.com/assets/external/widget.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script); // Limpa o script ao desmontar o componente
        };
    }, []);

    const openCalendlyPopup = () => {
        setIsPopupOpen(true);
        if (window.Calendly) {
            window.Calendly.initPopupWidget({ 
                url: 'https://calendly.com/calendario-parquedosmascotes/visita?background_color=1f1f1f&text_color=ffffff&primary_color=dfa430',
                onClose: () => setIsPopupOpen(false) // Fecha o overlay quando o Calendly for fechado
            });
        } else {
            console.error('Calendly script not loaded yet.');
        }
    };

    return (
        <>
            <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet" />
            <Button
                onClick={openCalendlyPopup}
                className={styles.button}
            >
                Agende uma visita
            </Button>
            {/* Overlay de fundo */}
            {isPopupOpen && <div className={styles.overlay}></div>}
        </>
    );
};

export default CalendlyLink;
