import { Suspense } from "react";
import SignUpContent from "./_components/SignUpContent";

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpContent />
    </Suspense>
  );
}
