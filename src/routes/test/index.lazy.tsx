import Test from "@/views/Test/Test";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/test/")({
  component: Test,
});
