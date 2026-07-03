import React from "react";

interface LockedChapterProps {
  redirect?: string;
}

export default function LockedChapter({ redirect = "rasterisation-and-anti-aliasing" }: LockedChapterProps) {
  return (
    <div className="not-prose z-20 mb-20 w-full max-w-xl max-sm:mb-0">
      <div className="mx-auto grid w-full -translate-y-8">
        <div>
          <form className="mx-auto @container grid h-full w-full content-center">
            <div
              data-intro-hidden="true"
              className="grid max-w-md data-[intro-hidden=true]:max-w-none data-[intro-hidden=false]:@lg:mx-auto"
            >
              <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2">
                <input
                  placeholder="Enter your email"
                  className="h-7 grow rounded border border-black/50 px-2 font-sans text-sm text-black uppercase [box-shadow:0px_0px_0px_2px_rgba(0,0,0,0.10)_inset] placeholder:text-black/30 focus-within:text-cobalt-600 focus:ring-0 focus:outline-cobalt-500 data-[disabled=true]:bg-black/5 data-[disabled=true]:text-black/50 data-[disabled=true]:opacity-50"
                  required
                  data-disabled="false"
                  type="email"
                  defaultValue=""
                  name="email"
                />
                <button
                  type="submit"
                  data-disabled="false"
                  className="grow data-[disabled=true]:opacity-50 @sm:shrink h-7 rounded border border-black/50 bg-white/50 px-2 font-sans text-sm text-nowrap uppercase [box-shadow:1px_1px_0px_2px_rgba(255,255,255,0.75)_inset,-1px_-1px_0px_2px_rgba(0,0,0,0.10)_inset] not-disabled:hover:border-black not-disabled:active:bg-black/10 disabled:opacity-50"
                >
                  Join mailing list
                </button>
              </div>
              <div className="mt-4 grid grid-cols-[auto_1fr] font-sans text-xs uppercase"></div>
            </div>
          </form>
          <p className="mx-auto max-w-md text-center text-sm text-pretty text-gray-700">
            This chapter is locked - enter your{" "}
            <a
              className="text-cobalt-600"
              href={`/validate-license?redirect=${redirect}`}
            >
              license key{" "}
            </a>
            to read it or sign up to the mailing list to get updates on free chapters.
          </p>
        </div>
      </div>
    </div>
  );
}
