import React from "react";
import Script from "next/script";

export default function LayoutFooter({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <>
            <Script 
                src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
                strategy="lazyOnload"
            />
            <div className="min-h-screen bg-background flex flex-col">
                <div className="flex-1 flex child-width-full">
                    {children}
                </div>
            </div>
        </>
    );
}
