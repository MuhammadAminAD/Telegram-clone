import chatbaze from "../schema/chatbaze.js"

export const editmessage = async (req, res) => {
      const userID = req.user._id
      const messageId = req.body.id
      const newtext = req.body.text

      try {
            const thismsg = await chatbaze.findOneAndUpdate(
                  { from: userID, _id: messageId },
                  { text: newtext }
            )

            if (thismsg) {
                  return res.status(200).json({
                        success: true,
                        message: "Xabar muvaffaqiyatli yangilandi.",
                  })
            } else {
                  return res.status(404).json({
                        success: false,
                        message: "Xabar topilmadi yoki sizga tegishli emas."
                  })
            }
      } catch (error) {
            return res.status(500).json({
                  success: false,
                  message: "Xatolik yuz berdi.",
                  error: error.message
            })
      }
}
