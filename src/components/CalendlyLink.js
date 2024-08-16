import React, { useEffect } from "react";
import Button from "./Button";
import styles from '../styles/CalendlyLink.module.css';

const CalendlyLink = () => {
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
        if (window.Calendly) {
            window.Calendly.initPopupWidget({ url: 'https://calendly.com/calendario-parquedosmascotes/visita?background_color=1f1f1f&text_color=ffffff&primary_color=dfa430' });
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
        </>
    );
};

export default CalendlyLink;
