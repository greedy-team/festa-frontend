import type { Metadata } from "next";
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) return {};

  const res = await getFestival(id);
  return res.ok ? { title: `${res.data.name} | FESTA` } : {};
}

export default async function FestivalDetailPage({ params }: Props) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const res = await getFestival(id);
  if (!res.ok) {
    if (res.status === 404) notFound();
    console.error("GET /festivals/{id} 실패", res.status, res.message);
    return (
      <Container className="mt-10 mb-16">
        <p className="mt-10 text-body text-muted">축제 정보를 불러오지 못했습니다.</p>
      </Container>
    );
  }
  const festival = res.data;

  return (
    <Container className="mt-10 mb-16 flex flex-col gap-16">
      <FestivalHero festival={festival} />
      <LineupSection lineup={festival.lineup} />
      <AdmissionInfo admission={festival.admission} />
      <LocationSection location={festival.location} />
    </Container>
  );
}
