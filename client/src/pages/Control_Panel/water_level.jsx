import { Droplets } from "lucide-react"

function Water_level({formattedWaterLevel,isDark,waterLevel}) {
  return (
    <section className="conb flex flex-col justify-start items-start bg-white center rounded-3xl p-7 shadow-lg border border-gray-50 transition-all hover:shadow-xl mb-6 min-h-[400px]">    
        <div className="flex flex-col h-full items-center justify-center">
            <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke={isDark ? "#3d56a4" : "#E8F3ED"} strokeWidth="8" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#3d56a4" strokeWidth="8"
                strokeDasharray={`${(Number(waterLevel) / 100) * 282.7} 282.7`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Droplets className="w-10 h-10 mb-2 text-[#3d56a4]" />
                <span className="text-4xl font-bold text-gray-800 dark:text-gray-100">{formattedWaterLevel }</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">%</span>
            </div>
            </div>
            <p className="text-base font-semibold text-gray-800 dark:text-gray-100 mt-4">Water Level</p>
        </div>
        
    </section>    
  )
}



export default Water_level