import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MailCheck, ArrowRight, RotateCw, CheckCircle2 } from 'lucide-react';

export function VerifyEmailPage() {
  const [resent, setResent] = useState(false);

  const handleResend = () => {
    setResent(true);
    setTimeout(() => setResent(false), 4000);
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto shadow-sm">
          <MailCheck className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Verify Your Email
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
            We sent a verification link to your registered email address. Click the link to complete account activation.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
          <p className="text-xs text-slate-500">
            Didn't receive the email? Check your spam folder or request a new verification link below.
          </p>

          {resent && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-700 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>A new verification link has been dispatched!</span>
            </div>
          )}

          <button
            onClick={handleResend}
            disabled={resent}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Resend Verification Email</span>
          </button>

          <div className="pt-3 border-t border-slate-100">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
            >
              <span>Continue to Customer Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
