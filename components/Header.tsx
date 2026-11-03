import { Badge } from "./tailgrids/core/badge";

export default function Header() {
    return (
        ///header container
        <div className="mt-4 text-center">
            <div className="flex justify-center gap-4">
                <Badge className="text-3xl rounded-lg py-1 px-3 bg-red-500 text-white rotate-10">C</Badge>
                <Badge className="text-3xl rounded-lg py-1 px-3 bg-green-500 text-white rotate-350">S</Badge>
                <Badge className="text-3xl rounded-lg py-1 px-3 bg-blue-300 text-white rotate-10">I</Badge>
                <Badge className="text-3xl rounded-lg py-1 px-3 bg-cyan-300 text-white rotate-350">2</Badge>
                <Badge className="text-3xl rounded-lg py-1 px-3 bg-yellow-300 text-white rotate-10">0</Badge>
                <Badge className="text-3xl rounded-lg py-1 px-3 bg-gray-300 text-white rotate-350">5</Badge>

            </div>
            <div className="mt-4">
                <Badge className="text-2xl font-bold rounded-lg py-1 bg-black text-white ">FRONT END SOFTWARE DEVELOPMENT</Badge>
            </div>

        </div>
        
    )
}