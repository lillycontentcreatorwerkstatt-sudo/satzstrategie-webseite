import type { Metadata } from "next";
import StudioShell from "../../components/StudioShell";
import WaitlistConfirm from "../../components/WaitlistConfirm";
import "../selbst-machen.css";

// Persönlicher Bestätigungslink aus der E-Mail, gehört nicht in Suchmaschinen.
export const metadata: Metadata = { title: "Warteliste bestätigen | Satzstrategie", robots: { index: false, follow: false } };

export default function WaitlistConfirmPage() {
  return <StudioShell active="/selbst-machen" flowFooter>
    <section className="diy-hero diy-confirm-page"><WaitlistConfirm /></section>
  </StudioShell>;
}
