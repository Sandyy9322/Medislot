import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)
  
  // Add filter states
  const [doctorFilter, setDoctorFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [filteredAppointments, setFilteredAppointments] = useState([])

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  // Apply filters whenever dashData, doctorFilter, or dateFilter changes
  useEffect(() => {
    if (dashData && dashData.latestAppointments) {
      let filtered = [...dashData.latestAppointments]
      
      // Filter by doctor name
      if (doctorFilter) {
        filtered = filtered.filter(appointment => 
          appointment.docData.name.toLowerCase().includes(doctorFilter.toLowerCase())
        )
      }
      
      // Filter by date - improved date comparison logic
      if (dateFilter) {
        filtered = filtered.filter(appointment => {
          try {
            // Check if appointment date string includes the date filter value
            // First try to extract the date from your formatted string display
            const dateString = slotDateFormat(appointment.slotDate);
            
            // Convert date filter to format that would match parts of your display format
            const selectedDate = new Date(dateFilter);
            const day = selectedDate.getDate();
            const month = selectedDate.toLocaleString('default', { month: 'short' });
            const year = selectedDate.getFullYear();
            
            // Create different possible date formats to check for
            const formats = [
              `${day} ${month} ${year}`,
              `${day}-${month}-${year}`,
              `${day} ${month}, ${year}`,
              `${month} ${day}, ${year}`,
              `${month} ${day} ${year}`
            ];
            
            // Debug what we're comparing
            console.log("Comparing:", {
              appointmentDate: dateString,
              filterFormats: formats,
              originalSlotDate: appointment.slotDate,
              filterDate: dateFilter
            });
            
            // Check if any format matches
            return formats.some(format => dateString.includes(format)) ||
                   new Date(appointment.slotDate).toDateString() === new Date(dateFilter).toDateString();
                   
          } catch (error) {
            console.error("Date comparison error:", error, {
              appointmentDate: appointment.slotDate,
              filterDate: dateFilter
            });
            return false;
          }
        });
        
        // Debug filtered results
        console.log(`Found ${filtered.length} appointments matching date filter: ${dateFilter}`);
      }
      
      setFilteredAppointments(filtered)
    }
  }, [dashData, doctorFilter, dateFilter, slotDateFormat])

  // Add this debug function to help understand the date formats
  const debugDateFormat = (date) => {
    if (!date) return "";
    try {
      const d = new Date(date);
      return {
        original: date,
        formatted: slotDateFormat(date),
        isoString: d.toISOString(),
        localString: d.toLocaleString(),
        dateString: d.toDateString()
      };
    } catch (e) {
      return `Error: ${e.message}`;
    }
  };

  return dashData && (
    <div className='m-5'>
      {/* Dashboard summary cards */}
      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.doctor_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.doctors}</p>
            <p className='text-gray-400'>Doctors</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.patients}</p>
            <p className='text-gray-400'>Patients</p>
          </div>
        </div>
      </div>

      {/* Latest bookings section */}
      <div className='bg-white mt-10 rounded border'>
        {/* Header */}
        <div className='flex items-center gap-2.5 px-6 py-4 border-b'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Latest Bookings</p>
        </div>

        {/* Filter section */}
        <div className='p-6 border-b'>
          <div className='flex flex-wrap gap-8'>
            <div className='flex flex-col flex-1'>
              <label className='text-gray-700 mb-2'>Doctor's Name</label>
              <input
                type="text"
                placeholder="Filter by doctor name"
                value={doctorFilter}
                onChange={(e) => setDoctorFilter(e.target.value)}
                className='px-4 py-3 border rounded focus:outline-none focus:border-blue-500'
              />
            </div>
            
            <div className='flex flex-col flex-1'>
              <label className='text-gray-700 mb-2'>Appointment Date</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => {
                  const newDate = e.target.value;
                  setDateFilter(newDate);
                  // Debug selected date
                  if (newDate) {
                    console.log("Selected date:", newDate);
                    console.log("Date object:", new Date(newDate).toDateString());
                  }
                }}
                className='px-4 py-3 border rounded focus:outline-none focus:border-blue-500'
              />
            </div>
          </div>
        </div>

        {/* Bookings list */}
        <div>
          {(doctorFilter || dateFilter ? filteredAppointments : dashData.latestAppointments).map((item, index) => (
            <div className='flex items-center px-6 py-5 gap-4 border-b last:border-b-0' key={index}>
              <img className='rounded-full w-16 h-16 object-cover' src={item.docData.image} alt="" />
              <div className='flex-1'>
                <p className='text-lg font-medium text-gray-800'>{item.docData.name}</p>
                <p className='text-gray-600'>Booking on {slotDateFormat(item.slotDate)}</p>
              </div>
              {item.cancelled ? (
                <p className='text-red-400 font-medium'>Cancelled</p>
              ) : item.isCompleted ? (
                <p className='text-green-500 font-medium'>Completed</p>
              ) : (
                <button 
                  onClick={() => cancelAppointment(item._id)} 
                  className='w-10 h-10 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-100'
                >
                  <img className='w-5' src={assets.cancel_icon} alt="Cancel" />
                </button>
              )}
            </div>
          ))}
          
          {/* Show message when no results match filters */}
          {(doctorFilter || dateFilter) && filteredAppointments.length === 0 && (
            <div className='text-center py-8 text-gray-500'>
              No bookings match your filter criteria
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard