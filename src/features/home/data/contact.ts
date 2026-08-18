import type { ContactSectionContent } from "@/features/home/types";

const primaryRecipientEmail = "bpm@bde-imtbs-tsp.fr";
const ccRecipientEmails = [
  "noemie.puechguiral@telecom-sudparis.eu"
];

const buildMailtoHref = (primaryRecipient: string, ccRecipients: string[]) => {
  const ccQuery = ccRecipients.length > 0 ? `?cc=${encodeURIComponent(ccRecipients.join(","))}` : "";
  return `mailto:${primaryRecipient}${ccQuery}`;
};

export const contactSectionContent: ContactSectionContent = {
  title: "Vous cherchez une prestation ?",
  actionLabel: "Contactez-nous par mail",
  metaText: "Développé par Nicolas Riedel et gentiment hebergé par Minet",
  primaryRecipientEmail,
  ccRecipientEmails,
  mailtoHref: buildMailtoHref(primaryRecipientEmail, ccRecipientEmails)
};
