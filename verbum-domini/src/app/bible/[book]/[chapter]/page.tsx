"use client";

import { use } from "react";
import { BibleReader } from "~/components/bible-reader";

export default function ReaderPage({
  params: paramsPromise,
}: {
  params: Promise<{ book: string; chapter: string }>;
}) {
  const params = use(paramsPromise);
  const chapterNum = parseInt(params.chapter);

  return <BibleReader bookAbbr={params.book} chapterNum={chapterNum} />;
}
