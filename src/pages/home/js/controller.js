var controller = {
	resourceTemp: {//记录当前用户观看平台域资源详情的开始和结束时间位置
		platCup: {//平台cpu资源
			startIndex: null,
			endIndex: null,
			startValue: null,
			endValue: null
		},
		platMemory: {//平台内存资源
			startIndex: null,
			endIndex: null,
			startValue: null,
			endValue: null
		}
	},
	vmrAttr: ["largeSmallVmr", "eightVmr"],
	terminalTemp: {//记录当前用户观看并发会议统计、并发会议在线终端统计、终端在线统计的开始和结束时间位置
		bfMeeting: {//并发会议统计
			startIndex: null,
			endIndex: null,
			startValue: null,
			endValue: null
		},
		bfOnlineMeeting: {//并发会议在线终端统计
			startIndex: null,
			endIndex: null,
			startValue: null,
			endValue: null
		},
		zdOnline: {//终端在线统计
			startIndex: null,
			endIndex: null,
			startValue: null,
			endValue: null
		}
	},

	isDataGridInit: {
		warmInfoDataGrid: null,
		callMeetingInfoDataGrid: null,
		bookMeetingInfoGrid: null,
		pastMeetingInfoGrid: null,
		meetingsInfoGrid: null,//传统、端口、点对点会议公用的一个展示接口

	},

	ajaxRequestArray: {//记录当前所有的ajax请求，在登出的时候，需要将所有当前请求断掉
		'getResourceLoadInfo': null,
		'getWarmInfo': null,
		'showPlatformResourceSeverInfo': null,
		'getPlatformCpuResourceServerInfo': null,
		'getPlatformMemoryResourceServerInfo': null,
		'getPlatformResourceInfo': null,
		'getConcurrentMeetingCount': null,
		'getConcurrentMeetingTerminalCount': null,
		'getMeetingTerminalCount': null,
		'getBookMeetingCountInfoCount': null,
		'getTransMeetingInfo': null,
		'getPortMeetingInfo': null,
		'getP2pMeetingInfo': null,
		'getLiveRoomInfo': null,
		'getLivingRoomInfo': null
	},
	isRequestCorrect: {
		"getResource": true,
		"getWarning": true,
		"getCpuPhysical": true,
		"getMemPhysical": true,
		"getCpuUsageHistory": true,
		"getMemUsageHistory": true,
		"getMeetingStatistic": true,
		"getTerminalStatistic": true,
		"getOnlineStatistic": true,
		"getAppointmentHistory": true,
		"getMeetings": true,
		"getLivesList": true,
		"getVrsResRoom": true,
		"getCallMeetingList": true,
		"listMeetingByCondition": true,
		"getAppointmentList": true,
		"listMeetingByCondition": true,
		"getHistoryMeetingList": true,
		"listMeetingByCondition": true
	},
	eightData: {//用于存储当前用户的八方会议或者大小型会议数据

	},
	allEightData: {
		largeSmallVmr: {
			item_resource_data: [{
				name: '大型会议室',
				used: 0,
				total: 0,
				id: 'large'
			}, {
				name: '小型会议室',
				used: 0,
				total: 0,
				id: 'small'
			}]
		},
		eightVmr: {
			item_resource_data: [{
				name: '8方720P',
				used: 0,
				total: 0,
				id: '8_720'
			}, {
				name: '8方1080P',
				used: 0,
				total: 0,
				id: '8_1080'
			}, {
				name: '32方720P',
				used: 0,
				total: 0,
				id: '32_720'
			}, {
				name: '32方1080P',
				used: 0,
				total: 0,
				id: '32_1080'
			}, {
				name: '64方720P',
				used: 0,
				total: 0,
				id: '64_720'
			}, {
				name: '64方1080P',
				used: 0,
				total: 0,
				id: '64_1080'
			}, {
				name: '192方720P',
				used: 0,
				total: 0,
				id: '192_720'
			}, {
				name: '192方1080P',
				used: 0,
				total: 0,
				id: '192_1080'
			}]
		}

	},
	mediaData: {//用于存储当前用户的媒体数据
		item_resource_data: [{
			name: '传统会议',
			used: 0,
			other: 0,
			available: 0,
			total: 0,
			id: 'tra_meeting',
			percent: 0,
			show: true
		}, {
			name: '端口资源',
			used: 0,
			other: 0,
			available: 0,
			total: 0,
			id: 'port_meeting',
			percent: 0,
			show: false
		}]
	},
	getIntData: function (totalUsed, total) {
		var percent = total == 0 ? 0 : totalUsed / total;
		percent = Math.round(percent * 100);
		if (percent === 0 && totalUsed > 0) {
			return 1;
		}
		if (percent === 100 && totalUsed < total) {
			return 99;
		}
		return percent;
	},
	getResourceLoadInfo: function () {//获取资源负载
		//ajax获取资源负载数据，并将其组装成resource_load_data形式
		var url = Mo.Config.appUrl + "/nms/getResource";
		var data = $.extend(true, {}, panelData.resource_load);
		var type = isServiceDomainAdmin ? 'service' : 'user';
		var requestGet = $.get(url, { 'type': type, 'moid': moid }, function (t) {
			if (t.success) {
				//处理虚拟会议室资源
				controller.eightData = [];
				var vmr = t.data.resource.vmr;
				/**根据env_type的数值显示数据**/
				var eightDataAttr = (vmr.env_type == '1' || vmr.env_type == '2') ? controller.vmrAttr[0] : controller.vmrAttr[1];
				var totalUsed = 0;
				var total = 0;
				for (var j = 0; j < controller.allEightData[eightDataAttr].item_resource_data.length; j++) {
					var temp = controller.allEightData[eightDataAttr].item_resource_data[j];
					temp.used = vmr["used_" + temp.id];
					temp.total = vmr["total_" + temp.id];
					totalUsed = totalUsed + temp.used;
					total = total + temp.total;
				}
				controller.eightData = [];
				controller.eightData = controller.allEightData[eightDataAttr].item_resource_data;

				// data.resourceData[0].percent = total==0?0:totalUsed/total;
				// data.resourceData[0].percent = Math.round(data.resourceData[0].percent*100);
				data.resourceData[0].percent = controller.getIntData(totalUsed, total);
				data.resourceData[0].showInfo = true;
				//处理会议并发介入终端数
				var access = t.data.resource.access;
				// data.resourceData[1].percent = (access.ap_total+access.g_ap_total)==0?0:(access.ap_used+access.g_ap_used)/(access.ap_total+access.g_ap_total);
				// data.resourceData[1].percent = Math.round(data.resourceData[1].percent*100)
				data.resourceData[1].percent = controller.getIntData((access.ap_used + access.g_ap_used), (access.ap_total + access.g_ap_total));
				data.resourceData[1].name = data.resourceData[1].name + "[" + (access.ap_used + access.g_ap_used) + "/" + (access.ap_total + access.g_ap_total) + "]";
				//处理媒体终端授权数
				var media = t.data.resource.media;
				var mediaTermialTotal = media.total_h264 + media.total_h265
				// data.resourceData[2].percent =mediaTermialTotal==0?0: (media.used_h264+media.used_h265)/mediaTermialTotal
				// data.resourceData[2].percent = Math.round(data.resourceData[2].percent*100);
				data.resourceData[2].percent = controller.getIntData((media.used_h264 + media.used_h265), mediaTermialTotal);
				data.resourceData[2].name = data.resourceData[2].name + "[" + (media.used_h264 + media.used_h265) + "/" + mediaTermialTotal + "]";
				//处理媒体资源
				if (data.resourceData.length == 4) {
					var traMeeting = t.data.resource.tra_meeting;
					var portMeeting = t.data.resource.port_meeting;
					var traMeetingUsed = 0;
					var traMeetingOther = 0;
					var traMeetingOtherUserDomain = 0;
					var traMeetingAvailable = 0;
					var traMeetingTotal = 0;
					var traMeetingPercent = 0;
					var portMeetingUsed = 0;
					var portMeetingOther = 0;
					var portMeetingOtherUserDomain = 0;
					var portMeetingAvailable = 0;
					var portMeetingTotal = 0;
					var portMeetingPercent = 0;
					var totalPercent = 0;
					if (!!traMeeting) {
						if (!!traMeeting.used && traMeeting.used > 0) {
							traMeetingUsed = traMeeting.used;
						}
						if (!!traMeeting.other && traMeeting.other > 0) {
							traMeetingOther = traMeeting.other;
						}
						if (!!traMeeting.remainder && traMeeting.remainder > 0) {
							traMeetingAvailable = traMeeting.remainder;
						}
						if (!!traMeeting.port_used && traMeeting.port_used > 0) {
							traMeetingOtherUserDomain = traMeeting.port_used;
						}
						traMeetingTotal = traMeetingUsed + traMeetingOther + traMeetingAvailable; //传统会议总数
						if (traMeetingTotal > 0) {
							traMeetingPercent = controller.getIntData(traMeetingUsed, traMeetingTotal);
						}
					}
					if (!!portMeeting && !!portMeeting.total) {
						controller.mediaData.item_resource_data[1].show = true;
						if (!!portMeeting.used && portMeeting.used > 0) {
							portMeetingUsed = portMeeting.used;
						}
						if (!!portMeeting.other && portMeeting.other > 0) {
							portMeetingOther = portMeeting.other;
						}
						if (!!portMeeting.remainder && portMeeting.remainder > 0) {
							portMeetingAvailable = portMeeting.remainder;
						}
						if (!!portMeeting.tra_used && portMeeting.tra_used > 0) {
							portMeetingOtherUserDomain = portMeeting.tra_used;
						}
						if (portMeeting.total > 0) {
							portMeetingTotal = portMeeting.total;
							portMeetingPercent = controller.getIntData(portMeetingUsed, portMeetingTotal);
						}
						//有端口会议 总百分比根据端口已使用数加本域的其他占用数计算 
						totalPercent = controller.getIntData(portMeetingUsed + (isServiceDomainAdmin ? portMeetingOther : portMeetingOtherUserDomain), portMeetingTotal);
					} else { //端口会议数据如果缺失则不显示
						controller.mediaData.item_resource_data[1].show = false;
						//没有端口会议 总百分比根据传统已使用数加本域的其他占用数计算 
						totalPercent = controller.getIntData(traMeetingUsed + (isServiceDomainAdmin ? traMeetingOther : traMeetingOtherUserDomain), traMeetingTotal);
					}
					data.resourceData[3].percent = totalPercent;
					data.resourceData[3].showInfo = true;
					controller.mediaData.item_resource_data[0].used = traMeetingUsed;
					controller.mediaData.item_resource_data[0].other = traMeetingOther;
					controller.mediaData.item_resource_data[0].available = traMeetingAvailable;
					controller.mediaData.item_resource_data[0].total = traMeetingTotal;
					controller.mediaData.item_resource_data[0].percent = traMeetingPercent;
					controller.mediaData.item_resource_data[1].used = portMeetingUsed;
					controller.mediaData.item_resource_data[1].other = portMeetingOther;
					controller.mediaData.item_resource_data[1].available = portMeetingAvailable;
					controller.mediaData.item_resource_data[1].total = portMeetingTotal;
					controller.mediaData.item_resource_data[1].percent = portMeetingPercent;
				}
			}
			panelData.resourceData = data.resourceData;
			var sourceHtml = template('resource-content', data);
			$(".resource-wrapper", "#resource_load").remove();
			$('#resource_load').append(sourceHtml)
			envent.resourceLoadEvent();
		}, 'json').error(function () {
			var sourceHtml = template('resource-content', data);
			$(".resource-wrapper", "#resource_load").remove();
			$('#resource_load').append(sourceHtml)
			envent.resourceLoadEvent();
		});
		controller.ajaxRequestArray.getResourceLoadInfo = requestGet
	},
	getEightConferenceInfo: function ($this) {//获取八方会议
		//ajax从后台获取数据并将其转换成eightConferenceData形式
		var data = { item_resource_data: this.eightData };
		var itemSourceHtml = template('resource-load-info', data)
		$(".item-resource-info-wrapper", $this.parent()).append(itemSourceHtml)
		var pieLessThan85Color = ['#1e94da', 'transparent'];
		var pieMoreThan85Color = ['#db4c4c', 'transparent'];
		var grayColor = ['transparent', '#d0d0d0']
		var resourceLoadOption = graphOption.resourceLoadOption;
		var resourceLoadGrayOption = graphOption.resourceLoadOption;
		for (var i = 0; i < data.item_resource_data.length; i++) {
			var item = data.item_resource_data[i]
			var usedPersent = controller.getIntData(item.used, item.total);
			var name = usedPersent + "%"

			//先绘制灰色图-未使用的图
			resourceLoadGrayOption.color = grayColor;
			resourceLoadGrayOption.data[0].value = item.used;
			resourceLoadGrayOption.data[1].value = item.total == 0 ? 1 : item.total - item.used;
			resourceLoadGrayOption.data[0].name = name
			resourceLoadGrayOption.animationAttr = false;
			var grayPieChart = echarts.init(document.getElementById(item.id + "_gray"), "");
			echartOption.getPieOption(resourceLoadGrayOption);
			//再绘制已使用的图
			var grayPieChartOption = echartOption.pieOption
			grayPieChart.setOption(grayPieChartOption)

			if (usedPersent >= 85) {
				resourceLoadOption.color = pieMoreThan85Color
			} else {
				resourceLoadOption.color = pieLessThan85Color
			}
			resourceLoadOption.data[0].value = item.used

			resourceLoadOption.data[1].value = item.total == 0 ? 1 : item.total - item.used;
			resourceLoadOption.animationAttr = true;

			var pieChart = echarts.init(document.getElementById(item.id), "");
			echartOption.getPieOption(resourceLoadOption);
			var pieChartOption = echartOption.pieOption;
			pieChart.setOption(pieChartOption);
		}

	},
	getMediaResourceInfo: function ($this) {//获取媒体资源
		var text = $(".foot-title-name", $this.parent()).text()
		var data = this.mediaData;
		var itemSourceHtml = template('media-resource-load-info', data)
		$(".item-resource-info-wrapper", $this.parent()).append(itemSourceHtml)
		var pieLessThan85Color = ['#1e94da', 'transparent'];
		var pieMoreThan85Color = ['#db4c4c', 'transparent'];
		var grayColor = ['transparent', '#d0d0d0']
		var resourceLoadOption = graphOption.resourceLoadOption;
		var resourceLoadGrayOption = graphOption.resourceLoadOption;
		for (var i = 0; i < data.item_resource_data.length; i++) {
			var item = data.item_resource_data[i]
			if (!item.show) {
				continue;
			}
			var usedPersent = item.percent;
			var name = usedPersent + "%"
			var itemUsedReal = item.total * item.percent / 100;
			var itemAvailableReal = itemUsedReal === 0 ? 1 : item.total - itemUsedReal;
			//先绘制灰色图-未使用的图
			resourceLoadGrayOption.color = grayColor;
			resourceLoadGrayOption.data[0].value = itemUsedReal;
			resourceLoadGrayOption.data[1].value = itemAvailableReal;
			resourceLoadGrayOption.data[0].name = name
			resourceLoadGrayOption.animationAttr = false;
			var grayPieChart = echarts.init(document.getElementById(item.id + "_gray"), "");
			echartOption.getPieOption(resourceLoadGrayOption);
			//再绘制已使用的图
			var grayPieChartOption = echartOption.pieOption
			grayPieChart.setOption(grayPieChartOption)

			if (usedPersent >= 85) {
				resourceLoadOption.color = pieMoreThan85Color
			} else {
				resourceLoadOption.color = pieLessThan85Color
			}
			resourceLoadOption.data[0].value = itemUsedReal;

			resourceLoadOption.data[1].value = itemAvailableReal;
			resourceLoadOption.animationAttr = true;

			var pieChart = echarts.init(document.getElementById(item.id), "");
			echartOption.getPieOption(resourceLoadOption);
			var pieChartOption = echartOption.pieOption;
			pieChart.setOption(pieChartOption);
		}
	},
	getWarmInfo: function () {//获取告警信息
		var url = Mo.Config.appUrl + "/nms/getWarning";
		var data = []
		var requestGet = $.get(url, { moid: moid, num: 10, level: 'critical' }, function (t) {//level:critical,important,normal 三种告警类型
			if (t.success) {
				data = t.data.unrepaired_warnings;
				showSubcribe(data);
			} else {
				showSubcribe(data);
			}
		}, 'json').error(function () {
			showSubcribe(data);
		});
		controller.ajaxRequestArray.getWarmInfo = requestGet
		function showSubcribe(data) {
			if (data.length != 0) {
				$(".no-data", "#subscribe_alarm").addClass("hidden")
				if (controller.isDataGridInit.warmInfoDataGrid != null) {
					$("#warm-grid").datagrid('loadData', data);
					return;
				}
				controller.isDataGridInit.warmInfoDataGrid = $("#warm-grid").datagrid({
					idField: "id",
					columns: [[
						{ field: 'id', hidden: true },
						{ field: 'start_time', width: 121, align: 'left' },
						{
							field: 'device_name', width: 241, align: 'left', formatter: function (value) {
								return '<div class="grid_td-item" title="' + value + '">' + value + '</div>'
							}
						},
						{
							field: 'description', width: 131, align: 'right', formatter: function (value) {
								return '<div class="grid_td-item" title="' + value + '">' + value + '</div>'
							}
						}
					]],
					onLoadSuccess: function () {
					}
				});
				$("#warm-grid").datagrid('loadData', data);
			} else {
				$(".no-data", "#subscribe_alarm").removeClass("hidden");
				controller.isDataGridInit.warmInfoDataGrid = null;
			}
		}
	},
	getBookMeetingCountInfoCount: function () {//获取预约并发会议统计（5.2SP2暂时隐藏，5.2SP4放开）
		//ajax从后端获取预约会议
		var url = Mo.Config.appUrl + "/nms/getAppointmentHistory";
		var data = {
			time: [],
			values: []
		}
		for (var i = 0; i < graphOption.bookMeetingOption.num; i++) {
			var currentTime = times.formatTimeHour(new Date(times.formatTimeHour(new Date(new Date().getTime() + i * times.oneHour))));
			currentTime = currentTime.replace(new RegExp('/', "g"), "-");
			currentTime = currentTime.slice(5, -3)
			data['time'].push(currentTime);
		}
		var start_time = times.formatTime(new Date());
		var end_time = times.formatTime(new Date(new Date(start_time).getTime() + times.oneDay));
		var requestGet = $.get(url, { 'moid': moid, 'start_time': start_time, 'end_time': end_time }, function (t) {
			if (t.success) {
				data = t.data.statistic;
				for (var i = 0; i < data['time'].length; i++) {
					data['time'][i] = data['time'][i].replace(new RegExp('/', "g"), "-");
					data['time'][i] = data['time'][i].slice(5, -3)
				}
				var bookMeetingCountData = null;
				if (panelData.hasOwnProperty("book_meeting_count")) {
					bookMeetingCountData = panelData.book_meeting_count;
				} else if (panelData.hasOwnProperty("resource_load") && panelData.resource_load.hasOwnProperty("book_meeting_count")) {
					bookMeetingCountData = panelData.resource_load.book_meeting_count;
				}
				var testData = [];
				if (data && data.values && data.values.length) {
					if (data.values) {
						for (var i = 0; i < data.values.length; i++) {
							if (data.values[i] > 0) {
								testData.push(data.values[i])
							}
						}
					}
				}
				var minMax = controller.getMinMaxValue(testData)//minData  maxData
				var average = controller.getAverageValue(testData)
				$(".maxValue", "#" + bookMeetingCountData.contentId).text(minMax.maxData);
				$(".minValue", "#" + bookMeetingCountData.contentId).text(minMax.minData);
				$(".averageValue", "#" + bookMeetingCountData.contentId).text(average);
				controller.setEchartsBarMaxValue(data.max);
			}
			drawGraph.drawBookMeetingGraph(data);
		}, 'json').error(function () {
			drawGraph.drawBookMeetingGraph(data);
		});
		controller.ajaxRequestArray.getBookMeetingCountInfoCount = requestGet

	},
	getTransMeetingInfo: function () {//获取传统会议信息
		var data = [];
		var url = Mo.Config.appUrl + "/nms/getMeetings";
		var requestGet = $.get(url, { 'moid': moid, 'count': 10, 'conf_type': 'tran' }, function (t) {
			if (t.success) {
				meetings = t.data.meetings;
				data = meetings;
				for (var i = 0; i < data.length; i++) {
					var startTimeDate = new Date(data[i].start_time)
					var startTimeDateStr = startTimeDate.toDateString();
					if (data[i].end_time == "") {
						data[i].time = data[i].start_time.slice(0, -3).replace(new RegExp('/', "g"), "-");
					} else {
						var endTimeDate = new Date(data[i].end_time)
						var endTimeDateStr = endTimeDate.toDateString();


						if (startTimeDateStr == currentDateStr && startTimeDateStr == endTimeDateStr) {//当天不显示日期
							var starthour = startTimeDate.getHours() < 10 ? '0' + startTimeDate.getHours() : startTimeDate.getHours();
							var startminiute = startTimeDate.getMinutes() < 10 ? '0' + startTimeDate.getMinutes() : startTimeDate.getMinutes()
							var endhour = endTimeDate.getHours() < 10 ? '0' + endTimeDate.getHours() : endTimeDate.getHours();
							var endminiute = endTimeDate.getMinutes() < 10 ? '0' + endTimeDate.getMinutes() : endTimeDate.getMinutes()
							data[i].time = starthour + ":" + startminiute + "-" + endhour + ":" + endminiute;
						} else {
							if (startTimeDateStr == endTimeDateStr) {
								data[i].time = data[i].start_time.slice(0, -3).replace(new RegExp('/', "g"), "-") + "-" + data[i].end_time.split(" ")[1].slice(0, -3);
							} else {
								data[i].time = data[i].start_time.slice(0, -3).replace(new RegExp('/', "g"), "-") + "-" + data[i].end_time.slice(0, -3).replace(new RegExp('/', "g"), "-");
							}

						}
					}

				}
			}
			controller.showCategoryMeetingInfo(data)
		}, 'json').error(function () {
			controller.showCategoryMeetingInfo(data)
		});
		controller.ajaxRequestArray.getTransMeetingInfo = requestGet
	},
	getPortMeetingInfo: function () {//获取端口会议信息
		var data = [];
		var url = Mo.Config.appUrl + "/nms/getMeetings";
		var requestGet = $.get(url, { 'moid': moid, 'count': 10, 'conf_type': 'port' }, function (t) {
			if (t.success) {
				meetings = t.data.meetings;
				data = meetings;
				for (var i = 0; i < data.length; i++) {
					var startTimeDate = new Date(data[i].start_time)
					var startTimeDateStr = startTimeDate.toDateString();
					if (data[i].end_time == "") {
						data[i].time = data[i].start_time.slice(0, -3).replace(new RegExp('/', "g"), "-");
					} else {
						var endTimeDate = new Date(data[i].end_time)
						var endTimeDateStr = endTimeDate.toDateString();


						if (startTimeDateStr == currentDateStr && startTimeDateStr == endTimeDateStr) {//当天不显示日期
							var starthour = startTimeDate.getHours() < 10 ? '0' + startTimeDate.getHours() : startTimeDate.getHours();
							var startminiute = startTimeDate.getMinutes() < 10 ? '0' + startTimeDate.getMinutes() : startTimeDate.getMinutes()
							var endhour = endTimeDate.getHours() < 10 ? '0' + endTimeDate.getHours() : endTimeDate.getHours();
							var endminiute = endTimeDate.getMinutes() < 10 ? '0' + endTimeDate.getMinutes() : endTimeDate.getMinutes()
							data[i].time = starthour + ":" + startminiute + "-" + endhour + ":" + endminiute;
						} else {
							if (startTimeDateStr == endTimeDateStr) {
								data[i].time = data[i].start_time.slice(0, -3).replace(new RegExp('/', "g"), "-") + "-" + data[i].end_time.split(" ")[1].slice(0, -3);
							} else {
								data[i].time = data[i].start_time.slice(0, -3).replace(new RegExp('/', "g"), "-") + "-" + data[i].end_time.slice(0, -3).replace(new RegExp('/', "g"), "-");
							}

						}
					}

				}
			}
			controller.showCategoryMeetingInfo(data)
		}, 'json').error(function () {
			controller.showCategoryMeetingInfo(data)
		});
		controller.ajaxRequestArray.getPortMeetingInfo = requestGet
	},
	getP2pMeetingInfo: function () {//获取点对点会议信息
		var data = [];
		var url = Mo.Config.appUrl + "/nms/getMeetings";
		var requestGet = $.get(url, { 'moid': moid, 'count': 10, 'conf_type': 'p2p' }, function (t) {
			if (t.success) {
				meetings = t.data.meetings;
				data = meetings;
				for (var i = 0; i < data.length; i++) {
					data[i].name = data[i].caller_name + " 呼叫 " + data[i].callee_name;
					data[i].time = data[i].start_time.replace(new RegExp('/', "g"), "-")
				}
			}
			controller.showCategoryMeetingInfo(data)
		}, 'json').error(function () {
			controller.showCategoryMeetingInfo(data)
		});
		controller.ajaxRequestArray.getP2pMeetingInfo = requestGet
	},
	showCategoryMeetingInfo: function (data) {//展示 传统会议  端口会议 点对点会议 信息
		if (data.length == 0) {
			$(".panel", "#meeting_category_info").hide();
			$(".no-data", "#meeting_category_info").removeClass("hidden");
			controller.isDataGridInit.meetingsInfoGrid = null;
		} else {
			$(".panel", "#meeting_category_info").show();
			$(".no-data", "#meeting_category_info").addClass("hidden");
			if (controller.isDataGridInit.meetingsInfoGrid != null) {
				$("#meeting_category-grid").datagrid('loadData', data);
				return;
			}
			controller.isDataGridInit.meetingsInfoGrid = $("#meeting_category-grid").datagrid({
				idField: "id",
				columns: [[
					{ field: 'id', hidden: true },
					{
						field: 'name', width: 252, align: 'left', formatter: function (value) {
							return '<div class="grid_td-item" title="' + value + '">' + value + '</div>'
						}
					},
					{ field: 'time', width: 256, align: 'right' }
				]],
				onLoadSuccess: function () {
				}
			});
			$("#meeting_category-grid").datagrid('loadData', data);
		}
	},
	getLiveRoomInfo: function () {//获取直播室信息
		var liveRoomData = { "roomstate": [] };
		var url = Mo.Config.appUrl + "/vrs/getVrsLiveRoom";
		var vrsInputData = {
			vrsIp: vrsIp,
			prgs1page: 6,
			pageid: 1,
			orderindex: 7,
			desc: 1
		}
		//核心域下 从网管处拿数据
		if ('coreDomain' === domainType) {
			url = Mo.Config.appUrl + "/nms/getLivesList";
			var requestGet = $.get(url, { 'moid': moid, num: 6 }, function (t) {
				if (t.success) {
					liveRoomData.roomstate = t.data.roomstate;
				}
				showLiveRoomInfo(liveRoomData);
			}, 'json').error(function () {
				showLiveRoomInfo(liveRoomData);
			});
			controller.ajaxRequestArray.getLiveRoomInfo = requestGet
		} else {//非核心域下 从录播处拿数据
			var requestGet = $.get(url, vrsInputData, function (t) {
				if (t.success) {
					liveRoomData.roomstate = t.data.roomstate;
				}
				showLiveRoomInfo(liveRoomData);
				envent.liveRoomEvent()
			}, 'json').error(function () {
				showLiveRoomInfo(liveRoomData);
				envent.liveRoomEvent()
			});
			controller.ajaxRequestArray.getLiveRoomInfo = requestGet
		}
		function showLiveRoomInfo(liveRoomData) {
			if (liveRoomData.roomstate.length == 0) {
				$(".no-data", "#live_room").removeClass("hidden")
				$(".warm-text", "#live_room").text("暂无直播")
			} else {
				$(".no-data", "#live_room").addClass("hidden")
				var liveHtml = template('VRS-live', liveRoomData);
				$("#live_room").empty();
				$("#live_room").append(liveHtml);
				SSO.common.setDefaultImg(".live_room");
			}
		}


	},
	getLivingRoomInfo: function () {//获取即将直播信息
		var url = Mo.Config.appUrl + "/vrs/getVrsResRoom";
		var vrsInputData = {
			vrsIp: vrsIp,
			prgs1page: 6,
			pageid: 1
		};
		var livingData = { "liveinfo": [] };

		//核心域下 从网管处拿数据
		if ('coreDomain' === domainType) {
			url = Mo.Config.appUrl + "/nms/getAppointedLivingList";
			controller.ajaxRequestArray.getLivingRoomInfo = $.get(url, { 'moid': moid, num: 6 }, function (t) {
				if (t.success) {
					livingData.liveinfo = t.data.liveinfo;
				}
				showLivingRoomInfo(livingData);
			}, 'json').error(function () {
				showLivingRoomInfo(livingData);
			});
		} else {//非核心域下 从录播处拿数据
			controller.ajaxRequestArray.getLivingRoomInfo = $.get(url, vrsInputData, function (t) {
				if (t.success) {
					livingData.liveinfo = t.data.liveinfo;
				}
				showLivingRoomInfo(livingData);
			}, 'json').error(function () {
				showLivingRoomInfo(livingData);
			});
		}
		function showLivingRoomInfo(livingData) {
			if (livingData.liveinfo.length === 0) {
				$(".no-data", "#living").removeClass("hidden");
				$(".warm-text", "#living").text("暂无即将直播的信息")
			} else {
				$(".no-data", "#living").addClass("hidden");
				var subscribeHtml = template('VRS-subscribe', livingData);
				var livingPanel = $('#living');
				livingPanel.empty();
				livingPanel.append(subscribeHtml);
			}
		}

	},
	getMinMaxValue: function (data) {
		var returnData = {
			minData: 0,
			maxData: 0
		}
		if (data.length > 0) {
			data.sort(function (a, b) { return a - b; });
			returnData.minData = data[0];
			returnData.maxData = data[data.length - 1];
		}
		return returnData;

	},
	getAverageValue: function (data) {
		var averageData = 0;
		if (data.length > 0) {
			averageData = Math.round(data.reduce(function (x, y) {
				return x + y;
			}) / data.length);
		}
		return averageData;
	},
	setConcurrentMeetingDes: function (detailOfMeetingTerminal, yData, startIndex, endIndex) {//并发会议统计的 描述信息计算  最大值  最小值 平均值
		var graphMultiValues = yData[0].slice(startIndex, endIndex + 1);//返回一个新的数组，包含从 start 到 end （不包括该元素）的 arrayObject 中的元素。
		var graphP2pValues = yData[1].slice(startIndex, endIndex + 1);

		if (graphMultiValues.length > 0) {
			var minMaxData = this.getMinMaxValue(graphMultiValues);
			detailOfMeetingTerminal.averageData.value1 = this.getAverageValue(graphMultiValues);
			detailOfMeetingTerminal.minData.value1 = minMaxData.minData;
			detailOfMeetingTerminal.maxData.value1 = minMaxData.maxData;
		}
		if (graphP2pValues.length > 0) {
			var minMaxData = this.getMinMaxValue(graphP2pValues);
			detailOfMeetingTerminal.averageData.value2 = this.getAverageValue(graphP2pValues);
			detailOfMeetingTerminal.minData.value2 = minMaxData.minData;
			detailOfMeetingTerminal.maxData.value2 = minMaxData.maxData;
		}
		if (yData.length > 2) {
			var graphTotalValues = yData[2].slice(startIndex, endIndex + 1);
			if (graphTotalValues.length > 0) {
				var minMaxData = this.getMinMaxValue(graphTotalValues);
				detailOfMeetingTerminal.averageData.value3 = this.getAverageValue(graphTotalValues);
				detailOfMeetingTerminal.minData.value3 = minMaxData.minData;
				detailOfMeetingTerminal.maxData.value3 = minMaxData.maxData;
			}
		}
		return detailOfMeetingTerminal;

	},
	setConcurrentMeetingTerminalDes: function (detailOfMeetingTerminal, yData, startIndex, endIndex) {//并发会议在线终端统计 描述信息计算  最大值  最小值 平均值
		var graphMultiValues = yData[0].slice(startIndex, endIndex + 1);//返回一个新的数组，包含从 start 到 end （不包括该元素）的 arrayObject 中的元素。
		var graphP2pValues = yData[1].slice(startIndex, endIndex + 1);

		if (graphMultiValues.length > 0) {
			var minMaxData = this.getMinMaxValue(graphMultiValues);
			detailOfMeetingTerminal.averageData.value1 = this.getAverageValue(graphMultiValues);
			detailOfMeetingTerminal.minData.value1 = minMaxData.minData;
			detailOfMeetingTerminal.maxData.value1 = minMaxData.maxData;
		}
		if (graphP2pValues.length > 0) {
			var minMaxData = this.getMinMaxValue(graphP2pValues);
			detailOfMeetingTerminal.averageData.value2 = this.getAverageValue(graphP2pValues);
			detailOfMeetingTerminal.minData.value2 = minMaxData.minData;
			detailOfMeetingTerminal.maxData.value2 = minMaxData.maxData;
		}
		return detailOfMeetingTerminal;


	},
	setTerminalDes: function (detailOfMeetingTerminal, yData, startIndex, endIndex) {//终端在线统计的 描述信息计算  最大值  最小值 平均值
		var sipValues = yData[0].slice(startIndex, endIndex + 1);
		var h323Values = yData[1].slice(startIndex, endIndex + 1);
		var allValues = yData[2].slice(startIndex, endIndex + 1);

		if (sipValues.length > 0) {
			var minMaxData = this.getMinMaxValue(sipValues);
			detailOfMeetingTerminal.averageData.value1 = this.getAverageValue(sipValues);
			detailOfMeetingTerminal.minData.value1 = minMaxData.minData;
			detailOfMeetingTerminal.maxData.value1 = minMaxData.maxData;
		}
		if (h323Values.length > 0) {
			var minMaxData = this.getMinMaxValue(h323Values);
			detailOfMeetingTerminal.averageData.value2 = this.getAverageValue(h323Values);
			detailOfMeetingTerminal.minData.value2 = minMaxData.minData;
			detailOfMeetingTerminal.maxData.value2 = minMaxData.maxData;
		}
		if (allValues.length > 0) {
			var minMaxData = this.getMinMaxValue(allValues);
			detailOfMeetingTerminal.averageData.value3 = this.getAverageValue(allValues);
			detailOfMeetingTerminal.minData.value3 = minMaxData.minData;
			detailOfMeetingTerminal.maxData.value3 = minMaxData.maxData;
		}
		return detailOfMeetingTerminal;
	},
	setEchartsLineMaxValue: function (maxValue) {
		if (maxValue <= 10) {
			echartOption.lineMaxValue = 10;
		}
		if (maxValue > 10 && maxValue <= 20) {
			echartOption.lineMaxValue = 20;
		}
		if (maxValue > 20 && maxValue <= 50) {
			echartOption.lineMaxValue = 50;
		}
		if (maxValue > 50 && maxValue <= 100) {
			echartOption.lineMaxValue = 100;
		}
		if (maxValue > 100) {
			echartOption.lineMaxValue = Math.ceil(maxValue / 100) * 100;
		}
		echartOption.lineMaxValue = echartOption.lineMaxValue == 0 ? 100 : echartOption.lineMaxValue;
	},
	setEchartsBarMaxValue: function (maxValue) {
		if (maxValue <= 50) {
			echartOption.barMaxValue = 50;
		}
		if (maxValue > 50 && maxValue <= 100) {
			echartOption.barMaxValue = 100;
		}
		if (maxValue > 100) {
			echartOption.barMaxValue = Math.ceil(maxValue / 100) * 100;
		}
		echartOption.barMaxValue = echartOption.barMaxValue == 0 ? 50 : echartOption.barMaxValue;
	},
	ssoToken: '',
	getSsoToken: function (callback) {
		url = Mo.Config.appUrl + "/getSsoToken";
		var requestGet = $.get(url, null, function (t) {
			if (t.success) {
				controller.ssoToken = t.data;
			} else {
				controller.ssoToken = '';
			}
			if (callback && typeof callback == "function") {
				callback(controller.ssoToken)
			}
		}, 'json').error(function () {
			controller.ssoToken = '';
			if (callback && typeof callback == "function") {
				callback(controller.ssoToken)
			}
		});
	}

}
var vrsRelated = {
	zeroBefore: function (number) {
		if (number < 10) {
			return "0" + number;
		}
		return number;
	},
	initTemplate: function () {
		template.defaults.imports.formatTime = function (param, timeStr) {
			param = Math.round(param);
			if (param < 0) {
				return null;
			}
			if (param < 60) {
				param = vrsRelated.zeroBefore(param);
				timeStr = "00:00:" + param;
			} else if (param >= 60 && param < 3600) {
				var min = vrsRelated.zeroBefore(Math.floor(param / 60));
				var secons = vrsRelated.zeroBefore(param % 60);
				timeStr = "00:" + min + ":" + secons;
			} else {
				var hour = vrsRelated.zeroBefore(Math.floor(param / 3600));
				var timeData = param % 3600
				var min = vrsRelated.zeroBefore(Math.floor(timeData / 60));
				var secons = vrsRelated.zeroBefore(timeData % 60);
				timeStr = hour + ":" + min + ":" + secons;
			}
			return timeStr;
		}
		template.defaults.imports.formatNum = function (num) {
			var result = '', counter = 0;
			num = (num || 0).toString();
			for (var i = num.length - 1; i >= 0; i--) {
				counter++;
				result = num.charAt(i) + result;
				if (!(counter % 3) && i != 0) { result = ',' + result; }
			}
			return result;
		}
		template.defaults.imports.formatPath = function (path) {
			return "//" + vrsIp + path;
		}
	}
}

var times = {
	tenSeconds: 10000,
	oneHour: 60 * 60 * 1000,
	oneDay: 24 * 60 * 60 * 1000,
	oneWeek: 7 * 24 * 60 * 60 * 1000,
	/*整点时间格式为 YY/MM/DD HH:00:00*/
	formatTimeHour: function (time) {
		var Year = time.getFullYear();
		var Month = time.getMonth() + 1;
		Month = Month < 10 ? '0' + Month : Month;
		var Date = time.getDate();
		Date = Date < 10 ? '0' + Date : Date;
		var Hour = time.getHours()
		Hour = Hour < 10 ? '0' + Hour : Hour;
		var timeStr = Year + "/" + Month + "/" + Date + " " + Hour + ":00:00";
		return timeStr;
	},
	/*时间格式为:YY/MM/DD HH:MM:SS*///网管的时间格式统一是此格式
	formatTime: function (time) {
		var Year = time.getFullYear();
		var Month = time.getMonth() + 1;
		Month = Month < 10 ? '0' + Month : Month;
		var Date = time.getDate();
		Date = Date < 10 ? '0' + Date : Date;
		var Hour = time.getHours()
		Hour = Hour < 10 ? '0' + Hour : Hour;
		var Minutes = time.getMinutes();
		Minutes = Minutes < 10 ? '0' + Minutes : Minutes;
		var Seconds = time.getSeconds();
		Seconds = Seconds < 10 ? '0' + Seconds : Seconds;
		var timeStr = Year + "/" + Month + "/" + Date + " " + Hour + ":" + Minutes + ":" + Seconds
		return timeStr;
	},
	/*传递给会管时间获取会议，时间格式：YY-MM-DD HH:MM:SS*/
	getCurrentTime: function (time) {
		if (!time) {
			time = new Date();
		}
		var currentTime = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
		return currentTime;
	}
}

var panelTips = {
	"正在召开的会议": {
		tips: "今日无会议安排，点击“创建会议”开始创会吧。",
		className: "call-meeting",
		callFun: function (idStr) {
			controller.getCallMeetingInfo(idStr);
		}
	},
	"预约的会议": {
		tips: "暂无预约的会议",
		className: "book-meeting",
		callFun: function (idStr) {
			controller.getBookMeetingInfo(idStr);
		}
	},
	"历史会议": {
		tips: "暂无历史会议",
		className: "past-meeting",
		callFun: function (idStr) {
			controller.getPastMeetingInfo(idStr);
		}
	},
	"传统会议": {
		tips: "暂无传统会议信息",
		className: "custom-meeting"
	},
	"端口会议": {
		tips: "暂无端口会议信息",
		className: "port-meeting"
	},
	"点对点会议": {
		tips: "暂无点对点会议信息",
		className: "point-point-meeting"
	},
	"直播室": {
		tips: "暂无直播",
		className: ""
	},
	"即将直播": {
		tips: "暂无即将直播的信息",
		className: ""
	},
}

var decriptionsOfMeeting = {
	"并发会议统计": {
		id: "concurrent-meeting",
		title: {
			name1: "多点会议",
			name2: "点对点会议"
		},
		maxData: {
			name: '最大并发会议数量',
			value1: 0,
			value2: 0,
		},
		minData: {
			name: '最小并发会议数量',
			value1: 0,
			value2: 0,
		},
		averageData: {
			name: '平均并发会议数量',
			value1: 0,
			value2: 0,
		}
	},
	"并发会议在线终端统计": {
		id: "concurrent-meeting-terminal",
		title: {
			name1: "多点会议",
			name2: "点对点会议"
		},
		maxData: {
			name: '最大并发终端数量',
			value1: 0,
			value2: 0,
		},
		minData: {
			name: '最小并发终端数量',
			value1: 0,
			value2: 0,
		},
		averageData: {
			name: '平均并发终端数量',
			value1: 0,
			value2: 0,
		}
	},
	"终端在线统计": {
		id: "terminal",
		title: {
			name1: "SIP",
			name2: "H.323",
			name3: "总和"
		},
		maxData: {
			name: '最大在线终端数量',
			value1: 0,
			value2: 0,
			value3: 0,
		},
		minData: {
			name: '最小在线终端数量',
			value1: 0,
			value2: 0,
			value3: 0,
		},
		averageData: {
			name: '平均在线终端数量',
			value1: 0,
			value2: 0,
			value3: 0,
		}
	}
}


export {controller,decriptionsOfMeeting,panelTips,times,vrsRelated}
