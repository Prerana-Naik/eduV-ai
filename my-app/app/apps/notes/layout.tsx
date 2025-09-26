// app/apps/notes/layout.tsx
export const metadata = {
  title: "My Personal Diary",
  description: "A beautiful diary app for your thoughts and memories",
};

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}