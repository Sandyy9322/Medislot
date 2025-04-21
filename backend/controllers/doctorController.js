import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import sendMail from '../utils/sendMail.js';


// API for doctor Login 
const loginDoctor = async (req, res) => {

    try {

        const { email, password } = req.body
        const user = await doctorModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
    try {

        const { docId } = req.body
        const appointments = await appointmentModel.find({ docId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment for doctor panel
// const appointmentCancel = async (req, res) => {
//     try {

//         const { docId, appointmentId } = req.body

//         const appointmentData = await appointmentModel.findById(appointmentId)
//         if (appointmentData && appointmentData.docId === docId) {
//             await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
//             return res.json({ success: true, message: 'Appointment Cancelled' })
//         }

//         res.json({ success: false, message: 'Appointment Cancelled' })

//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: error.message })
//     }

// }


const appointmentCancel = async (req, res) => {
    try {
      const { docId, appointmentId } = req.body;
      console.log("Cancel request for appointmentId:", appointmentId);
  
      // Fetch appointment with userData already included
      const appointment = await appointmentModel.findById(appointmentId);
  
      if (!appointment) {
        console.log("Appointment not found");
        return res.json({ success: false, message: "Appointment not found" });
      }
  
      // Check if the appointment belongs to this doctor
      if (appointment.docId.toString() !== docId.toString()) {
        console.log("Unauthorized doctor");
        return res.json({ success: false, message: "Unauthorized to modify this appointment" });
      }
  
      // Check if the appointment is already cancelled or completed
      if (appointment.cancelled || appointment.isCompleted) {
        console.log("Appointment already cancelled or completed");
        return res.json({ success: false, message: "Appointment already cancelled or completed" });
      }
  
      // Update the appointment status - IMPORTANT: Update both status and cancelled flag
      appointment.status = "Cancelled";
      appointment.cancelled = true;
      await appointment.save();
      console.log("Appointment status updated to Cancelled");
  
      // Get user email directly from userData
      const userEmail = appointment.userData?.email;
      console.log("User email for cancellation:", userEmail);
  
      if (userEmail) {
        await sendMail(
          userEmail,
          "Appointment Cancelled",
          `Dear Patient, 

We regret to inform you that your upcoming appointment on ${appointment.slotDate} at ${appointment.slotTime} has been canceled due to unforeseen circumstances.
We sincerely apologize for the inconvenience. Please contact us at your earliest convenience to reschedule your appointment. Your health is important to us, and we’ll do our best to accommodate your preferred time.

Thank you for your understanding.`
        );
        console.log("Cancellation email sent successfully to", userEmail);
      }
  
      res.json({ success: true, message: "Appointment cancelled successfully." });
    } catch (error) {
      console.error("Error in appointmentCancel controller:", error);
      res.json({ success: false, message: error.message });
    }
  };
  
  


// API to mark appointment completed for doctor panel
// const appointmentComplete = async (req, res) => {
//     try {

//         const { docId, appointmentId } = req.body

//         const appointmentData = await appointmentModel.findById(appointmentId)
//         if (appointmentData && appointmentData.docId === docId) {
//             await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
//             return res.json({ success: true, message: 'Appointment Completed' })
//         }

//         res.json({ success: false, message: 'Appointment Cancelled' })

//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: error.message })
//     }


const appointmentComplete = async (req, res) => {
    try {
      const { docId, appointmentId } = req.body;
      console.log("Completing appointment ID:", appointmentId);
  
      // Fetch appointment
      const appointment = await appointmentModel.findById(appointmentId);
  
      if (!appointment) {
        console.log("Appointment not found");
        return res.json({ success: false, message: "Appointment not found" });
      }
  
      // Check if the appointment belongs to this doctor
      if (appointment.docId.toString() !== docId.toString()) {
        console.log("Unauthorized doctor");
        return res.json({ success: false, message: "Unauthorized to modify this appointment" });
      }
  
      // Check if the appointment is already cancelled or completed
      if (appointment.cancelled || appointment.isCompleted) {
        console.log("Appointment already cancelled or completed");
        return res.json({ success: false, message: "Appointment already cancelled or completed" });
      }
  
      // Update the appointment status - IMPORTANT: Update both status and isCompleted flag
      appointment.status = "Completed";
      appointment.isCompleted = true;
      await appointment.save();
      console.log("Appointment status updated to Completed");
  
      // Get user email directly from userData
      const userEmail = appointment.userData?.email;
      console.log("Sending email to:", userEmail);
  
      if (userEmail) {
        await sendMail(
          userEmail,
          "Appointment Completed",
          `Dear Patient, 

Thank you for visiting us today. Your appointment on ${appointment.slotDate} at ${appointment.slotTime} has been successfully completed. 
It was a pleasure meeting with you. Please remember to follow the recommendations discussed during your visit. If you have any questions, concerns, or need to schedule a follow-up, feel free to contact our office.

Wishing you good health and wellness! `
        );
        console.log("Completion email sent successfully to", userEmail);
      }
  
      res.json({ success: true, message: "Appointment completed successfully." });
    } catch (error) {
      console.error("Error in appointmentComplete controller:", error);
      res.json({ success: false, message: error.message });
    }
  };


// API to get all doctors list for Frontend
const doctorList = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to change doctor availablity for Admin and Doctor Panel
const changeAvailablity = async (req, res) => {
    try {

        const { docId } = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availablity Changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor profile for  Doctor Panel
const doctorProfile = async (req, res) => {
    try {

        const { docId } = req.body
        const profileData = await doctorModel.findById(docId).select('-password')

        res.json({ success: true, profileData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update doctor profile data from  Doctor Panel
const updateDoctorProfile = async (req, res) => {
    try {

        const { docId, fees, address, available } = req.body

        await doctorModel.findByIdAndUpdate(docId, { fees, address, available })

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
    try {

        const { docId } = req.body

        const appointments = await appointmentModel.find({ docId })

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })



        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    loginDoctor,
    appointmentsDoctor,
    appointmentCancel,
    doctorList,
    changeAvailablity,
    appointmentComplete,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile
}