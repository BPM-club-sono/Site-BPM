import type { TeamMemberNode } from "@/features/team/types";
import adamPhoto from "@/assets/pp_team/28/Adam.webp";
import alexandrePhoto from "@/assets/pp_team/28/Alexandre.webp";
import alpPhoto from "@/assets/pp_team/28/Alp.webp";
import antoinePhoto from "@/assets/pp_team/28/Antoine.webp";
import charlesPhoto from "@/assets/pp_team/28/Charles.webp";
import corentinPhoto from "@/assets/pp_team/28/Corentin.webp";
import cyrilPhoto from "@/assets/pp_team/28/Cyril.webp";
import erwanPhoto from "@/assets/pp_team/28/Erwan.webp";
import gianniPhoto from "@/assets/pp_team/28/Gianni.webp";
import joanPhoto from "@/assets/pp_team/28/Joan.webp";
import jonathanPhoto from "@/assets/pp_team/28/Jonathan.webp";
import julesPhoto from "@/assets/pp_team/28/Jules.webp";
import julesVogelPhoto from "@/assets/pp_team/28/JulesVogel.webp";
import lauriannePhoto from "@/assets/pp_team/28/Laurianne.webp";
import lisaPhoto from "@/assets/pp_team/28/Lisa.webp";
import manuelPhoto from "@/assets/pp_team/28/Manuel.webp";
import maximePhoto from "@/assets/pp_team/28/Maxime.webp";
import noemiePhoto from "@/assets/pp_team/28/Noemie.webp";
import oumeimaPhoto from "@/assets/pp_team/28/Oumeima.webp";
import pierrePhoto from "@/assets/pp_team/28/Pierre.webp";
import quentinPhoto from "@/assets/pp_team/28/Quentin.webp";
import rodolphPhoto from "@/assets/pp_team/28/Rodolph.webp";
import titouanPhoto from "@/assets/pp_team/28/Titouan.webp";
import yannPhoto from "@/assets/pp_team/28/Yann.webp";

export const teamMembers28: TeamMemberNode[] = [
  { id: "rodolph", name: "Rodolphe", role: "Président", photo: rodolphPhoto, x: 0, y: -250 },

  { id: "antoine", name: "Antoine", role: "VP Trésor", photo: antoinePhoto, x: -100, y: 50 },
  { id: "adam", name: "Adam", role: "VP Lights", photo: adamPhoto, x: -200, y: -150 },
  { id: "erwan", name: "Erwan", role: "VP Son", photo: erwanPhoto, x: 200, y: -150 },
  { id: "noemie", name: "Noémie", role: "Secrétaire", photo: noemiePhoto, x: 100, y: 50 },

  { id: "jules", name: "Jules", role: "Respo Lights", photo: julesPhoto, x: -500, y: -150 },
  { id: "quentin", name: "Quentin", role: "Respo Son", photo: quentinPhoto, x: 500, y: -150 },
  { id: "titouan", name: "Titouan", role: "Respo Écran", photo: titouanPhoto, x: -1000, y: -250 },

  { id: "laurianne", name: "Laurianne", role: "Pôle Lights", photo: lauriannePhoto, x: -700, y: -250 },
  { id: "joan", name: "Joan", role: "Pôle Lights", photo: joanPhoto, x: -700, y: -50 },
  { id: "alp", name: "Alp", role: "Pôle Son", photo: alpPhoto, x: 700, y: -50 },
  { id: "corentin", name: "Corentin", role: "Pôle Son", photo: corentinPhoto, x: 700, y: -250 },
  { id: "pierre", name: "Pierre", role: "Pôle Écran", photo: pierrePhoto, x: -1000, y: -50 },

  { id: "cyril", name: "Cyril", role: "Réparation", photo: cyrilPhoto, x: 1000, y: -250 },
  { id: "julesvogel", name: "Jules Vogel", role: "Réparation", photo: julesVogelPhoto, x: 1000, y: -50 },
  { id: "yann", name: "Yann", role: "Logistique", photo: yannPhoto, x: 100, y: 350 },
  { id: "maxime", name: "Maxime", role: "Logistique", photo: maximePhoto, x: -100, y: 350 },
  { id: "gianni", name: "Gianni", role: "Prod", photo: gianniPhoto, x: 1000, y: 450 },
  { id: "alexandre", name: "Alexandre", role: "Prod", photo: alexandrePhoto, x: 1000, y: 250 },
  { id: "lisa", name: "Lisa", role: "RI", photo: lisaPhoto, x: 700, y: 350 },

  { id: "manuel", name: "Manuel", role: "VDP", photo: manuelPhoto, x: -700, y: 350 },
  { id: "charles", name: "Charles", role: "Conan", photo: charlesPhoto, x: -400, y: 350 },
  { id: "oumeima", name: "Oumeima", role: "Communication", photo: oumeimaPhoto, x: -1000, y: 250 },
  { id: "jonathan", name: "Jonathan", role: "Numérique", photo: jonathanPhoto, x: 400, y: 350 }
];
