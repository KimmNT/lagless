import Bingo from "@/views/Bingo/Bingo";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/bingo/")({
  component: Bingo,
});
