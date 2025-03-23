const fs = require("fs");

module.exports = {
	config: {
		name: "approved",
		version: "1.0",
		author: "Rifat",
		countDown: 5,
		role: 2, // Restricted to bot owners or admins
		shortDescription: {
			vi: "Phê duyệt nhóm",
			en: "Approve group"
		},
		longDescription: {
			vi: "Phê duyệt nhóm và lưu vào tệp approved.json",
			en: "Approve group and save it to approved.json"
		},
		category: "admin",
		guide: {
			vi: "Sử dụng: /approved <tid>",
			en: "Usage: /approved <tid>"
		}
	},

	langs: {
		vi: {
			missingTid: "Vui lòng cung cấp ID nhóm (tid) để phê duyệt.",
			alreadyApproved: "Nhóm với ID %1 đã được phê duyệt trước đó.",
			approved: "✅ Nhóm với ID %1 đã được phê duyệt và lưu thành công.",
			error: "❌ Đã xảy ra lỗi khi phê duyệt nhóm."
		},
		en: {
			missingTid: "Please provide a group ID (tid) to approve.",
			alreadyApproved: "The group with ID %1 is already approved.",
			approved: "✅ The group with ID %1 has been approved and saved successfully.",
			error: "❌ An error occurred while approving the group."
		}
	},

	onStart: async function ({ args, api, message, getLang }) {
		const approvedFile = "./approved.json";

		// Ensure approved.json exists
		if (!fs.existsSync(approvedFile)) {
			fs.writeFileSync(approvedFile, JSON.stringify([]));
		}

		// Load approved groups
		const approvedGroups = JSON.parse(fs.readFileSync(approvedFile, "utf-8"));

		// Check if tid is provided
		const tid = args[0];
		if (!tid) {
			return message.reply(getLang("missingTid"));
		}

		// Check if the group is already approved
		if (approvedGroups.includes(tid)) {
			return message.reply(getLang("alreadyApproved", tid));
		}

		// Add the group to the approved list
		try {
			approvedGroups.push(tid);
			fs.writeFileSync(approvedFile, JSON.stringify(approvedGroups, null, 2));
			message.reply(getLang("approved", tid));
		} catch (error) {
			console.error(error);
			message.reply(getLang("error"));
		}
	}
};
