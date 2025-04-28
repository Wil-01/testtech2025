import { Separator } from "@/components/ui/separator";

export default function NotFound() {
  return (
    <div className={"flex h-screen w-full items-center justify-center"}>
      <div className={"flex h-12 items-center gap-4"}>
        <p className={"text-3xl"}>404</p>
        <Separator orientation={"vertical"} />
        <p className={"text-2xl font-thin"}>Cette page n'existe pas.</p>
      </div>
    </div>
  );
}
