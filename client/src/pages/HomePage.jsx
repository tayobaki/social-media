import { TabsDisplay } from "@/components/TabsDisplay";
import { useQuery } from "@tanstack/react-query";

export default function HomePage() {
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });
  // const editor = useEditor({
  //   extensions: [Document, Paragraph, Text],
  //   content: `<strong>Money is ijieix</strong>`,
  // });

  return (
    <div className="h-full">
      <TabsDisplay user={authUser} />
    </div>
  );
}
