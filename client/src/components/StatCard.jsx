import React from 'react'

const StatCard = ({title,value,icon,color}) => {

    const colorMap = {indigo:'bg-indigo-100',green:'bg-green-100',yellow:'bg-yellow-100'}


  return (
    <div className='bg-white rounded-lg border border-gray-200 p-6'>
        <div className='flex items-center justify-between'>
            <div>
                <p className='text-sm font-medium to-gray-600'>{title}</p>
                <p className='test-2xl font-bold text-gray-600'>{value}</p>
            </div>
            <div className={`size-12 ${colorMap[color]} rounded-full flex items-center justify-center`}>{icon}</div>
        </div>


    </div>
  )
}

export default StatCard