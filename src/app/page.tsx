import { redirect } from "next/navigation";

export default function Home() {
  // land on the Production Calendar by default
  redirect("/production/calendar");
}
