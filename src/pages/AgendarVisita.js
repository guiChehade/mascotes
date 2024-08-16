import React, { useEffect } from "react";
import styles from '../styles/AgendarVisita.module.css';

const AgendarVisita = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://assets.calendly.com/assets/external/widget.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className={styles.calendlyContainer}>
            <div 
                className="calendly-inline-widget"
                data-url="https://calendly.com/calendario-parquedosmascotes?background_color=1f1f1f&text_color=ffffff&primary_color=dfa430" 
                style={{ width: '100%' }}
            >
            </div>
        </div>
    );
};

export default AgendarVisita;
