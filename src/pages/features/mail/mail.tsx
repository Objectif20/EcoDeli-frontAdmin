import { useEffect, useMemo, useState } from "react";
import { EmailDataTable } from "@/components/features/mail/data-table";
import { PaginationControls } from "@/components/pagination-controle";

export default function EmailPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const exampleData = [
    {
      id: "1",
      subject : "Test",
        sentDate: "2021-09-01",
        isSent: true,
        author : "John Doe",
        profiles: ["admin"],
        content : "<ol class=\"list-node\"><li><p class=\"text-node\">Problème à résoudre...</p></li></ol><h1 class=\"heading-node\">dfsdf</h1><p class=\"text-node\"><strong>Test</strong></p><p class=\"text-node\"></p><p class=\"text-node\"><em>kjdsqkjdqks</em></p><p class=\"text-node\"></p><p class=\"text-node\"><u>jkdqksjdqksj</u></p><p class=\"text-node\"></p><p class=\"text-node\"><span style=\"color: var(--mt-accent-bold-blue)\">sdfsdfsdf</span></p><p class=\"text-node\"><code class=\"inline\" spellcheck=\"false\">sdfsdfsdfsd</code></p><p class=\"text-node\"></p><pre class=\"block-node\"><code>zerzerzerzer</code></pre><hr><p class=\"text-node\"></p><p class=\"text-node\"><a class=\"link\" href=\"https://test.com\" target=\"_blank\">test</a></p><p class=\"text-node\"></p><img src=\"https://cdn.futura-sciences.com/cdn-cgi/image/width=1024,quality=60,format=auto/sources/images/dossier/773/01-intro-773.jpg\" alt=\"\" title=\"\" id=\"knyjjyot8\" width=\"464\" height=\"241\"><p class=\"text-node\"></p><img src=\"https://cdn.futura-sciences.com/sources/images/dossier/773/01-intro-773.jpg\" alt=\"\" title=\"\" id=\"u356ma2rp\" width=\"460\" height=\"239\" filename=\"original.jpg\"><p class=\"text-node\"></p><blockquote class=\"block-node\"><p class=\"text-node\">zerzer</p></blockquote>"
,
        isNewsletter: false,
      },
  ];

  const paginatedData = useMemo(() => {
    const startIndex = pageIndex * pageSize;
    const endIndex = Math.min(startIndex + pageSize, exampleData.length);
    return exampleData.slice(startIndex, endIndex);
  }, [pageIndex, pageSize, exampleData]);

  useEffect(() => {
    setPageIndex(0);
  }, [pageSize]);


  return (
    <>
      <EmailDataTable key={`${pageIndex}-${pageSize}`} data={paginatedData} />
      <PaginationControls
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalItems={exampleData.length}
        onPageIndexChange={setPageIndex}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPageIndex(0);
        }}
      />
    </>
  );
}
