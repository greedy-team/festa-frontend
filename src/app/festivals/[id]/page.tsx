import { notFound } from "next/navigation";
import { getFestival } from "@/features/festivals/api";
import { FestivalHero } from "@/features/festivals/components/FestivalHero";
import { LineupSection } from "@/features/festivals/components/LineupSection";
import { AdmissionInfo } from "@/features/festivals/components/AdmissionInfo";
import { LocationSection } from "@/features/festivals/components/LocationSection";
import { Container } from "@/components/layout/Container";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function FestivalDetailPage({ params }: Props) {
  const { id: idParam } = await params;
  const id = Number(idParam);

  const res = await getFestival(id);
  if (!res.ok) notFound();
  const festival = res.data;

  return (
    <Container className="mt-10 mb-16 flex flex-col gap-10">
      <FestivalHero festival={festival} />
      <LineupSection lineup={festival.lineup} />
      <AdmissionInfo admission={festival.admission} />
      <LocationSection location={festival.location} />
    </Container>
  );
}
