"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { TextField, SelectField } from "@/components/Field";
import { Button } from "@/components/Button";
import { LinkButton } from "@/components/LinkButton";
import { Note } from "@/components/Note";
import { Spinner } from "@/components/Spinner";
import { CameraCapture } from "@/components/CameraCapture";
import { Stamp } from "@/components/Stamp";
import { isValidWorkEmail, WORK_EMAIL_ERROR } from "@/lib/email";
import { api, ApiError } from "@/lib/api";
import type { Department } from "@/lib/types";

type Step = 1 | 2 | 3 | 4 | 5 | "done";

// Sign-up as a wizard: one field group per screen, one big Next button.
export default function SignupPage() {
  const router = useRouter();

  const [departments, setDepartments] = useState<Department[] | null>(null);
  const [deptError, setDeptError] = useState("");

  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [photo, setPhoto] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Load departments once, ready for step 3.
  useEffect(() => {
    let active = true;
    api
      .getDepartments()
      .then((d) => active && setDepartments(d))
      .catch(
        () =>
          active &&
          setDeptError("We couldn't load departments. Please try again."),
      );
    return () => {
      active = false;
    };
  }, []);

  function back() {
    setError("");
    if (step === 1) {
      router.push("/");
    } else if (typeof step === "number") {
      setStep((step - 1) as Step);
    }
  }

  function next(to: Step) {
    setError("");
    setStep(to);
  }

  function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!isValidWorkEmail(email)) {
      setError(WORK_EMAIL_ERROR);
      return;
    }
    next(2);
  }

  function submitName(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter both your first and last name.");
      return;
    }
    next(3);
  }

  function submitDepartment(e: React.FormEvent) {
    e.preventDefault();
    if (!departmentId) {
      setError("Please choose your department.");
      return;
    }
    next(4);
  }

  function submitPassword(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setError("Please choose a password of at least 6 characters.");
      return;
    }
    next(5);
  }

  // Step 5: reference photo -> create the account in the database.
  async function createAccount(referencePhotoUrl: string) {
    setPhoto(referencePhotoUrl);
    setCreating(true);
    setSubmitError("");
    try {
      await api.signup({
        email,
        firstName,
        lastName,
        departmentId,
        password,
        referencePhotoUrl,
      });
      setStep("done");
    } catch (err) {
      setSubmitError(
        err instanceof ApiError
          ? err.message
          : "We couldn't create your account. Please try again.",
      );
      setCreating(false);
    }
  }

  if (step === "done") {
    return (
      <Screen title="Account created">
        <div className="flex flex-col items-center text-center">
          <Stamp />
          <h2 className="mt-6 text-[28px] font-bold text-ink">
            Account created - pending approval
          </h2>
          <Note tone="pending">
            <p>
              Your account has been sent to your TETFUND administrator for
              approval. Once they activate it, you&apos;ll be able to sign in and
              clock in each day.
            </p>
            <p className="mt-3">
              This usually happens within one working day. You don&apos;t need to
              do anything else right now.
            </p>
          </Note>
          <div className="mt-7 w-full">
            <LinkButton href="/login">Back to sign in</LinkButton>
          </div>
        </div>
      </Screen>
    );
  }

  const stepTitles: Record<number, string> = {
    1: "Your work email",
    2: "Your name",
    3: "Your department",
    4: "Choose a password",
    5: "Take your reference photo",
  };

  return (
    <Screen title="Create account" onBack={back}>
      <p className="mb-1 text-[16px] font-bold text-ink-soft">Step {step} of 5</p>
      <h2 className="mb-5 text-[28px] font-bold leading-tight text-ink">
        {stepTitles[step as number]}
      </h2>

      {step === 1 && (
        <form onSubmit={submitEmail} className="flex flex-col gap-5">
          <TextField
            label="Work email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            hint="Use the official email your office issued you."
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            error={error}
            placeholder="you@tetfund.gov.ng"
            autoFocus
          />
          <Button type="submit">Next</Button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={submitName} className="flex flex-col gap-5">
          <TextField
            label="First name"
            name="firstName"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              setError("");
            }}
            autoFocus
          />
          <TextField
            label="Last name"
            name="lastName"
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              setError("");
            }}
            error={error}
          />
          <Button type="submit">Next</Button>
        </form>
      )}

      {step === 3 && (
        <>
          {deptError && <Note tone="error">{deptError}</Note>}
          {!departments && !deptError && (
            <div className="flex items-center gap-3 text-ink-soft">
              <span className="text-brand">
                <Spinner />
              </span>
              Loading departments…
            </div>
          )}
          {departments && departments.length > 0 && (
            <form onSubmit={submitDepartment} className="flex flex-col gap-5">
              <SelectField
                label="Department"
                name="department"
                value={departmentId}
                onChange={(e) => {
                  setDepartmentId(e.target.value);
                  setError("");
                }}
              >
                <option value="">Select your department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </SelectField>
              {error && <Note tone="error">{error}</Note>}
              <Button type="submit">Next</Button>
            </form>
          )}
          {departments && departments.length === 0 && (
            <Note tone="error">
              No departments are set up yet. Please contact your administrator.
            </Note>
          )}
        </>
      )}

      {step === 4 && (
        <form onSubmit={submitPassword} className="flex flex-col gap-5">
          <TextField
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            hint="At least 6 characters."
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            error={error}
            autoFocus
          />
          <Button type="submit">Next</Button>
        </form>
      )}

      {step === 5 && (
        <div className="flex flex-col gap-5">
          {creating ? (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <span className="text-brand">
                <Spinner size={40} />
              </span>
              <p className="text-[18px] text-ink-soft">
                Creating your account…
              </p>
            </div>
          ) : submitError ? (
            <>
              <Note tone="error">{submitError}</Note>
              <Button onClick={() => photo && createAccount(photo)}>
                Try again
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setPhoto(null);
                  setSubmitError("");
                }}
              >
                Take a different photo
              </Button>
            </>
          ) : (
            <>
              <p className="text-ink-soft">
                This photo is your reference picture. Your administrator uses it
                to check it&apos;s really you when you clock in. Look at the
                camera and take a clear photo of your face.
              </p>
              <CameraCapture
                onConfirm={createAccount}
                confirmLabel="Use this photo & create account"
                facingMode="user"
              />
            </>
          )}
        </div>
      )}
    </Screen>
  );
}
