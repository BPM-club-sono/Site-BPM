import { useEffect, useState } from "react";
import PageShell from "@/shared/components/layout/PageShell";
import InlineNav from "@/shared/components/navigation/InlineNav";
import "./EventsPage.css";

type EventData = {
  name: string;
  order: number;
  when: string;
  personnes: number;
  where: string;
  prix: number;
};

type EventPayload = {
  data: EventData;
  content: string[];
};

type EventDataMap = Record<string, EventPayload>;
type EventImageMap = Record<string, string>;

type TimelineEvent = EventData & {
  slug: string;
  content: string[];
  photos: Array<{
    src: string;
    alt: string;
  }>;
};

type LightboxPhoto = {
  src: string;
  alt: string;
};

const eventDataModules = import.meta.glob("../../assets/events_page/*/data.json", {
  eager: true,
  import: "default"
}) as EventDataMap;

const eventImageModules = import.meta.glob("../../assets/events_page/*/*.{jpg,jpeg,png,webp,avif}", {
  eager: true,
  import: "default"
}) as EventImageMap;

const numberFormatter = new Intl.NumberFormat("fr-FR");

const getFolderNameFromPath = (path: string) => {
  const normalizedPath = path.replace(/\\/g, "/");
  const segments = normalizedPath.split("/");
  return segments[segments.length - 2] ?? "";
};

const formatPeople = (count: number) => `${numberFormatter.format(count)} pers.`;
const formatPrice = (amount: number) => `${numberFormatter.format(amount)} €`;

const timelineEvents: TimelineEvent[] = (() => {
  const imagesByFolder = Object.entries(eventImageModules)
    .sort(([leftPath], [rightPath]) => leftPath.localeCompare(rightPath))
    .reduce<Record<string, string[]>>((accumulator, [assetPath, src]) => {
      const folderName = getFolderNameFromPath(assetPath);
      if (!accumulator[folderName]) {
        accumulator[folderName] = [];
      }
      accumulator[folderName].push(src);
      return accumulator;
    }, {});

  return Object.entries(eventDataModules)
    .map(([assetPath, payload]) => {
      const folderName = getFolderNameFromPath(assetPath);
      const photos = (imagesByFolder[folderName] ?? []).map((src, index) => ({
        src,
        alt: `${payload.data.name} - photo ${index + 1}`
      }));

      return {
        ...payload.data,
        slug: folderName,
        content: payload.content,
        photos
      };
    })
    .sort((leftEvent, rightEvent) => leftEvent.order - rightEvent.order);
})();

const EventsPage = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<LightboxPhoto | null>(null);

  useEffect(() => {
    if (!selectedPhoto) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedPhoto(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedPhoto]);

  return (
    <PageShell pageClassName="events-page" hideToggleAtTop>
      <section className="events-page__hero">
        <InlineNav className="events-page__nav" />
        <p className="events-page__kicker">BPM Club Light & Sono</p>
        <h1>Nos Grosses Prestations</h1>
      </section>

      <section className="events-timeline" aria-label="Timeline des evenements">
        {timelineEvents.map((event, index) => (
          <article
            key={`${event.slug}-${event.order}`}
            className={`timeline-event ${index % 2 === 0 ? "timeline-event--left" : "timeline-event--right"}`}
          >
            <div className="timeline-event__marker" aria-hidden="true">
              <span>{event.order}</span>
            </div>

            <div className="timeline-event__side timeline-event__side--details">
              <header className="timeline-event__heading">
                <h2>{event.name}</h2>
                <p>{event.when}</p>
              </header>

              <div className="timeline-event__cards">
                <section className="timeline-event__card timeline-event__card--info" aria-label={`Infos ${event.name}`}>
                  <ul className="timeline-event__meta-list">
                    <li>
                      <span>Date</span>
                      <strong>{event.when}</strong>
                    </li>
                    <li>
                      <span>Personnes</span>
                      <strong>{formatPeople(event.personnes)}</strong>
                    </li>
                    <li>
                      <span>Lieu</span>
                      <strong>{event.where}</strong>
                    </li>
                    <li>
                      <span>Prix</span>
                      <strong>{formatPrice(event.prix)}</strong>
                    </li>
                  </ul>
                </section>

                <section
                  className="timeline-event__card timeline-event__card--content"
                  aria-label={`Prestations ${event.name}`}
                >
                  <h3>Mise en place</h3>
                  <ul>
                    {event.content.map((item, itemIndex) => (
                      <li key={`${event.slug}-content-${itemIndex}`}>{item}</li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>

            <div className="timeline-event__side timeline-event__side--media">
              {event.photos.length > 0 ? (
                <section className="timeline-event__gallery" aria-label={`Photos ${event.name}`}>
                  {event.photos.map((photo) => (
                    <figure key={photo.src} className="timeline-event__photo">
                      <button
                        type="button"
                        className="timeline-event__photo-button"
                        onClick={() => setSelectedPhoto(photo)}
                        aria-label={`Agrandir ${photo.alt}`}
                      >
                        <img src={photo.src} alt={photo.alt} loading="lazy" />
                      </button>
                    </figure>
                  ))}
                </section>
              ) : null}
            </div>
          </article>
        ))}
      </section>

      {selectedPhoto ? (
        <div
          className="events-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photo en grand"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            type="button"
            className="events-lightbox__close"
            onClick={() => setSelectedPhoto(null)}
            aria-label="Fermer la photo"
          >
            Fermer
          </button>
          <figure className="events-lightbox__figure" onClick={(event) => event.stopPropagation()}>
            <img src={selectedPhoto.src} alt={selectedPhoto.alt} />
            <figcaption>{selectedPhoto.alt}</figcaption>
          </figure>
        </div>
      ) : null}
    </PageShell>
  );
};

export default EventsPage;
