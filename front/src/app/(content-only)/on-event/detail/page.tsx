import Image from "next/image"

export default function OnEventDetail() {
    return (
        <Image 
            src="/images/event-coffee-details.jpg" 
            alt="OnEventDetail" 
            width={400} 
            height={5500} 
            className="w-full h-full object-cover"
        />
    )
}