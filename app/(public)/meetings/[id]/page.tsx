import MeetingDetailPage from "@/components/MeetingDetailPage";

interface MeetingPageProps {
  params: Promise<{ id: string }>;
}

export default async function MeetingPage({ params }: MeetingPageProps) {
  const { id } = await params;
  return <MeetingDetailPage id={id} />;
}
