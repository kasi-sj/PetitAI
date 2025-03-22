const axios = require("axios");
require("dotenv").config();

module.exports = async (message) => {
  const notificationData = JSON.parse(message);
  const { type, value } = notificationData;
  const status = value?.status;
  const desc = value?.description;
  const petitionId = value?.petitionId;

  const {
    fromUserId,
    organizationUserAssignments,
    tag,
    subject,
    body,
    createdAt,
  } = await getPetitionDetail(petitionId);

  const { name, email } = await getUserDetail(fromUserId);

  let organizationUser_name = null;
  let organizationUser_email = null;

  let organizationUserEmailBody = null;

  if (
    status === "ASSIGNED" ||
    status === "FORWARDED" ||
    status === "DELEGATED"
  ) {
    const lastAssignment =
      organizationUserAssignments[organizationUserAssignments.length - 1];

    if (lastAssignment) {
      const organizationUserDetails = await getOrganizationUserDetail(
        lastAssignment.organizationUserId
      );
      organizationUser_name = organizationUserDetails?.name || "N/A";
      organizationUser_email = organizationUserDetails?.email || "N/A";
    }

    organizationUserEmailBody = generateOrganizationUserEmail({
      status,
      status_description: desc,
      petition_id: petitionId,
      createdAt,
      petition_subject: subject,
      petition_description: body,
      tag,
      organizationUser_name,
      organizationUser_email,
      userName: name,
      userEmail: email,
    });

    await sendEmail(
      organizationUser_email,
      `Petition Assignment Notification`,
      organizationUserEmailBody
    );
  }

  const emailBody = generateUserEmail({
    subject,
    status,
    status_description: desc,
    petition_id: petitionId,
    createdAt,
    petition_subject: subject,
    petition_description: body,
    tag,
    organizationUser_name,
    organizationUser_email,
  });

  console.log("ALL DATA", {
    subject,
    status,
    organizationUser_email,
    organizationUser_name,
    email,
    name,
    tag,
    petitionId,
    createdAt,
    body,
    desc,
  });

  await sendEmail(email, `Your Petition's Current  Status`, emailBody);
};

async function getOrganizationUserDetail(organizationUserId) {
  try {
    const response = await axios.get(
      `${process.env.API_BASE_URL}/organization-users/${organizationUserId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error fetching organization user details on get organization user"
      //   error.message
    );
    return {};
  }
}

async function getUserDetail(userId) {
  try {
    const response = await axios.get(
      `${process.env.API_BASE_URL}/users/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching user details on getUser");
    return {};
  }
}

async function getPetitionDetail(petitionId) {
  try {
    const response = await axios.get(
      `${process.env.API_BASE_URL}/petitions/${petitionId}`
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching petition details: on petition");
    return {};
  }
}

async function sendEmail(to, subject, text) {
  try {
    const body = {
      to: to,
      subject: subject,
      text: text,
    };
    const headers = {
      "Content-Type": "application/json",
      "x-api-key": process.env.X_API_KEY,
    };
    const response = await axios.post(`${process.env.MAIL_URL}/email`, body, {
      headers,
    });
    console.log("✉️ Email sent:");
    return response.data;
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    return {};
  }
}

const generateUserEmail = ({
  subject,
  status,
  status_description,
  petition_id,
  createdAt,
  petition_subject,
  petition_description,
  tag,
  organizationUser_name,
  organizationUser_email,
}) => {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Petition Status Update</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <table width="100%" cellspacing="0" cellpadding="10" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 2px 10px rgba(0,0,0,0.1);">
        <tr>
            <td style="background-color: #007bff; color: #ffffff; padding: 15px; font-size: 18px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                <strong>Petition Status Update</strong>
            </td>
        </tr>
        <tr>
            <td style="padding: 15px; color: #333;">
                <p>Dear User,</p>
                <p>Your petition regarding "<strong>${subject}</strong>" has been updated.</p>
                
                <h3 style="color: #007bff;">Current Status: ${status}</h3>
                <p>${status_description}</p>

                <h4 style="color: #333;">Petition Details:</h4>
                <p><strong>Petition ID:</strong> ${petition_id}</p>
                <p><strong>Created On:</strong> ${createdAt}</p>

                <h4 style="color: #333;">Petition Content:</h4>
                <p><strong>Subject:</strong> ${petition_subject}</p>
                <p><strong>Description:</strong> ${petition_description}</p>
              
                ${
                  status === "ASSIGNED"
                    ? `
                <h4 style="color: #333;">Assigned To:</h4>
                <p><strong>Name:</strong> ${organizationUser_name}</p>
                <p><strong>Email:</strong> ${
                  organizationUser_email || "N/A"
                }</p>`
                    : ""
                }
                
                <p style="margin-top: 20px;">You can check the status of your petition anytime by logging into your account.</p>
                <p>If you have any further concerns, please reach out to the HR department.</p>
            </td>
        </tr>
        <tr>
            <td style="background-color: #f8f9fa; color: #666; text-align: center; padding: 10px; font-size: 12px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                <p>${tag}  | This is an automated email, please do not reply.</p>
            </td>
        </tr>
    </table>
</body>
</html>`;
};

const generateOrganizationUserEmail = ({
  status,
  status_description,
  petition_id,
  createdAt,
  petition_subject,
  petition_description,
  tag,
  organizationUser_name,
  organizationUser_email,
  userName,
  userEmail,
}) => {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Petition Assignment Notification</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <table width="100%" cellspacing="0" cellpadding="10" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 2px 10px rgba(0,0,0,0.1);">
        <tr>
            <td style="background-color: #28a745; color: #ffffff; padding: 15px; font-size: 18px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                <strong>Petition Assignment Notification</strong>
            </td>
        </tr>
        <tr>
            <td style="padding: 15px; color: #333;">
                <p>Dear ${organizationUser_name},</p>
                <p>A new petition has been <strong>${status.toLowerCase()}</strong> to you.</p>
                
                <h3 style="color: #28a745;">Status: ${status}</h3>
                <p>${status_description}</p>

                <h4 style="color: #333;">Petition Details:</h4>
                <p><strong>Petition ID:</strong> ${petition_id}</p>
                <p><strong>Created On:</strong> ${createdAt}</p>

                <h4 style="color: #333;">Petition Content:</h4>
                <p><strong>Subject:</strong> ${petition_subject}</p>
                <p><strong>Description:</strong> ${petition_description}</p>

                <h4 style="color: #333;">Submitted By:</h4>
                <p><strong>Name:</strong> ${userName}</p>
                <p><strong>Email:</strong> ${userEmail}</p>

                <p style="margin-top: 20px;">Please review the petition and take the necessary actions.</p>
                <p>If you have any questions, feel free to contact the HR department.</p>
            </td>
        </tr>
        <tr>
            <td style="background-color: #f8f9fa; color: #666; text-align: center; padding: 10px; font-size: 12px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                <p>${tag}  | This is an automated email, please do not reply.</p>
            </td>
        </tr>
    </table>
</body>
</html>`;
};
