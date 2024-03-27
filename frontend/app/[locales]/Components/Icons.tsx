import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faGoogle,
    faFacebookF,
    faInstagram,
    faDiscord,
    faYoutube,
    faPaypal,
    faFigma,
    faBehance,
    faTwitch,
    faXTwitter,
    faSteam,
    faTiktok,
    faGithub,
} from "@fortawesome/free-brands-svg-icons";
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'; // Asegúrate de importar IconDefinition

// Mapeo de strings a íconos
const SvgLogos = {
    "google": faGoogle,
    "facebook": faFacebookF,
    "instagram": faInstagram,
    "discord": faDiscord,
    "youtube": faYoutube,
    "paypal": faPaypal,
    "figma": faFigma,
    "behance": faBehance,
    "twitch": faTwitch,
    "twitter": faXTwitter,
    "steam": faSteam,
    "tiktok": faTiktok,
    "github": faGithub,
};

type SvgLogoKeys = keyof typeof SvgLogos; // 'google' | 'facebook' | 'instagram' | ...

interface IconProps {
    name: SvgLogoKeys; // Usar el tipo de las claves de SvgLogos
}

const Icon: React.FC<IconProps> = ({ name }) => {
    const icon: IconDefinition = SvgLogos[name]; // TypeScript ahora entiende que esto es seguro

    return <FontAwesomeIcon icon={icon} className="text-back text-4xl" />;
};

export default Icon;