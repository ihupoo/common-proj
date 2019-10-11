package com.kedacom.sso.portal;

/**
 * 各子系统相关链接的URI
 * @author luocanfeng
 * @date 2014-7-16
 */
public class URIConstants {

	/* 导航 */
	// BMC系统导航
	public static final String BMC_WEB_NAVIGATION = "/index.jsp";
	// AMC系统导航
	public static final String AMC_WEB_NAVIGATION = "/index.jsp";
	// 网管系统导航
	public static final String NMS_WEB_NAVIGATION = "/index.html";
	// 微博系统导航
	public static final String SNS_WEB_NAVIGATION = "/index.jsp";
	// 会议管理系统导航
	public static final String MEETING_WEB_NAVIGATION = "/index.jsp";
	// 网络视频会议系统导航
	public static final String WEBCONF_WEB_NAVIGATION = "/index.html";
	// 会议录播系统导航
	public static final String VRS_WEB_NAVIGATION = "/index.html";
	// 数据会议系统导航
	public static final String DCS_WEB_NAVIGATION = "/index.html";

	/* 其他链接 */
	// 公告板
	public static final String AMC_WEB_BOARDS = "/boards";
	// 创建会议
	public static final String MEETING_WEB_CREATE_MEETING = "/createMeeting";

	/* BMC */
	// BMC系统统计报表界面
	public static final String BMC_STATISTICS_REPORT = "/report.jsp";
	// BMC系统API - 会议比例
	public static final String BMC_API_MEETING_PROPORTION = "/meeting/proportion";
	// BMC系统API - 会议概况
	public static final String BMC_API_MEETING_OVERVIEW = "/meeting/overview";
	// BMC系统API - 会议时长
	public static final String BMC_API_MEETING_DURATION = "/meeting/duration";
	// BMC系统API - 会议频率
	public static final String BMC_API_MEETING_RATE = "/meeting/rate";

	/* 会议管理 */
	// 会议日程
	public static final String MEETING_API_LIST_MEETING = "/meeting/list";

	/* NMS */
	// 网管系统API - 平台负荷（含注册、媒体资源、并发资源、网口吞吐量等数据）
	public static final String NMS_API_PLATFORM_CHARGE = "/platformCharge";
	// 网管系统API - 域视图
	public static final String NMS_API_DOMAIN_VIEW = "/domainView";

}
