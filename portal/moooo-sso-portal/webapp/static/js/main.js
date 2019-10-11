/**
 * 工具
 * 
 * */
$.namespace("SSO.main");
SSO.main={
     init:function(){
	     SSO.common.init();
         this.initPlatformCharge();//平台负荷
         this.initMeetingCharge();//会议比例
         this.initDomainView();//域视图
         this.initMeetingDuration();//会议时长
         this.initMeetingFrequency();//会议频率
         
     },
     initMeetingFrequency:function(){//会议频率
          /*折线图 start*/
         var myChart5 = echarts.init($('#meeting_frequency_statistics')[0]);
         var lineOption = {
            animation:false,
            addDataAnimation:false,
            color:["#66a585"],
            grid:{
                borderWidth:0
            },
            tooltip : {
                trigger: 'item',
                formatter:function(value,b,c,d){// a（系列名称），b（类目值），c（数值）, d（无）
                    return value[1]+"时"+value[2]+"个会议室正在使用";
                }
            },
            calculable : false,
            xAxis : [
                {
                	scale:true,
                    type : 'category',
                    axisLabel : {
                        formatter: function(value){
                             if(0 == value){
                                return "0";
                             }else if(6 == value){
                                return "6 ";
                             }else if(12 == value){
                                return "12 ";
                             }else if(18 == value){
                                return "18 ";
                             }else if(23 == value){
                                return "23 ";
                             }else{
                                return "";
                             }
                        }
                    },
                    axisLine:{
                        show:true,
                        lineStyle:{
                            color:'#b2b2b2'
                        }
                    },
                    splitLine:{
                        show:false
                    },
                    axisTick:{
                        show:false
                    },
                    data:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel : {
                        formatter: '{value} 个'
                    },
                    axisLine:{
                        show:true,
                        lineStyle:{
                            color:'#b2b2b2'
                        }
                    },
                    splitLine:{
                        show:false
                    }
                }
            ],
            series : [
                {
                    name:'会议室使用个数',
                    type:'line',
                    data:[3,0,0,0,0,0,0,0,0,3,30,10,6,6,8,8,5,1,2,0,1,0,0,0],
                    markPoint : {
                        itemStyle: {
                            normal: {
                                color:'#66a585'
                            }
                        },
                        data : [
                            {type : 'max', name: '最大值'}
                        ]
                    }
                }
            ]
         };
         myChart5.setOption(lineOption);               
        /*折线图 end*/
     },
     initMeetingDuration:function(){//会议时长
         /*散点图 start*/
         var myChart4 = echarts.init($('#meeting_duration_statistics')[0]);
         var scatterOption = {
	         grid:{
	             borderWidth:0
	         },
	         tooltip : {
	             trigger: 'item',
	             formatter : function (value) {
	                 return value[0] + value[2][0] +' 共有 ' +value[2][1] + ' 小时会议'; 
	             }
	         },
	         legend : {
	             data : ['多点会议', '点对点会议']
	         },
	         xAxis : [
	             {
	                 type : 'category',
	                 axisLabel: {
	                     formatter : function(v) {
	                         return  v
	                     }
	                 },
	                 splitLine:{
                         show:false
                     },
	                 data : ["2014-01-01","2014-01-02","2014-01-03","2014-01-04","2014-01-05","2014-01-06","2014-01-07","2014-01-08","2014-01-09","2014-01-10","2014-01-11","2014-01-12","2014-01-13","2014-01-14","2014-01-15","2014-01-16","2014-01-17","2014-01-18","2014-01-19","2014-01-20","2014-01-21","2014-01-22","2014-01-23","2014-01-24","2014-01-25","2014-01-26","2014-01-27","2014-01-28","2014-01-29","2014-01-30","2014-01-31","2014-02-01","2014-02-02","2014-02-03","2014-02-04","2014-02-05","2014-02-06","2014-02-07","2014-02-08","2014-02-09","2014-02-10","2014-02-11","2014-02-12","2014-02-13","2014-02-14","2014-02-15","2014-02-16","2014-02-17","2014-02-18","2014-02-19","2014-02-20","2014-02-21","2014-02-22","2014-02-23","2014-02-24","2014-02-25","2014-02-26","2014-02-27","2014-02-28","2014-02-29","2014-03-01","2014-03-02","2014-03-03","2014-03-04","2014-03-05","2014-03-06","2014-03-07","2014-03-08","2014-03-09","2014-03-10","2014-03-11","2014-03-12","2014-03-13","2014-03-14","2014-03-15","2014-03-16","2014-03-17","2014-03-18","2014-03-19","2014-03-20","2014-03-21","2014-03-22","2014-03-23","2014-03-24","2014-03-25","2014-03-26","2014-03-27","2014-03-28","2014-03-29","2014-03-30","2014-03-31",]
	             }
	         ],
	         yAxis : [
	                  {
	                      type : 'value',
	                      precision: 0,
	                      scale:false,
	                      axisLabel : {
	                          formatter: '{value} h'
	                      },
	                      axisLine:{
	                          show:true,
	                          lineStyle:{
	                              color:'#b2b2b2'
	                          }
	                      },
	                      splitLine:{
	                          show:false
	                      }
	                  }
	         ],
	         animation: false,
	         series : [
	             {
	                 name:'多点会议',
	                 type:'scatter',
	                 symbol:'circle',
	                 data : [["2014-01-01",2],["2014-01-02",20],["2014-01-03",30],["2014-01-04",14],["2014-01-05",15],["2014-01-06",26],["2014-01-07",27],["2014-01-08",38],["2014-01-09",49],["2014-01-10",10],["2014-01-11",11],["2014-01-12",42],["2014-01-13",33],["2014-01-14",134],["2014-01-15",55],["2014-01-16",46],["2014-01-17",47],["2014-01-18",58],["2014-01-19",69],["2014-01-20",40],["2014-01-21",41],["2014-01-22",42],["2014-01-23",43],["2014-01-24",44],["2014-01-25",45],["2014-01-26",66],["2014-01-27",67],["2014-01-28",28],["2014-01-29",29],["2014-01-30",30],["2014-01-31",11],["2014-02-01",2],["2014-02-02",20],["2014-02-03",30],["2014-02-04",14],["2014-02-05",15],["2014-02-06",26],["2014-02-07",27],["2014-02-08",38],["2014-02-09",49],["2014-02-10",10],["2014-02-11",11],["2014-02-12",42],["2014-02-13",33],["2014-02-14",134],["2014-02-15",55],["2014-02-16",46],["2014-02-17",47],["2014-02-18",58],["2014-02-19",69],["2014-02-20",40],["2014-02-21",41],["2014-02-22",42],["2014-02-23",43],["2014-02-24",44],["2014-02-25",45],["2014-02-26",66],["2014-02-27",67],["2014-02-28",28],["2014-02-29",29],["2014-03-01",2],["2014-03-02",20],["2014-03-03",30],["2014-03-04",14],["2014-03-05",15],["2014-03-06",26],["2014-03-07",27],["2014-03-08",38],["2014-03-09",49],["2014-03-10",10],["2014-03-11",11],["2014-03-12",42],["2014-03-13",33],["2014-03-14",134],["2014-03-15",55],["2014-03-16",46],["2014-03-17",47],["2014-03-18",58],["2014-03-19",69],["2014-03-20",40],["2014-03-21",41],["2014-03-22",42],["2014-03-23",43],["2014-03-24",44],["2014-03-25",45],["2014-03-26",66],["2014-03-27",67],["2014-03-28",28],["2014-03-29",29],["2014-03-30",30],["2014-03-31",11]],
	                 markPoint : {
	                        data : [
	                            {type : 'max', name: '最大值'},
	                            {type : 'min', name: '最小值'}
	                        ]
	                 },
	                 markLine : {
	                        data : [
	                            {type : 'average', name: '平均值'}
	                        ]
	                 }
	             },
	             {
	                 name:'点对点会议',
	                 type:'scatter',
	                 symbol:'rectangle',
	                 data : [["2014-01-01",1,30],["2014-01-02",2,30],["2014-01-03",3],["2014-01-04",4],["2014-01-05",5],["2014-01-06",6],["2014-01-07",7],["2014-01-08",8],["2014-01-09",9],["2014-01-10",10],["2014-01-11",11],["2014-01-12",12],["2014-01-13",13],["2014-01-14",14],["2014-01-15",15],["2014-01-16",16],["2014-01-17",17],["2014-01-18",18],["2014-01-19",19],["2014-01-20",20],["2014-01-21",21],["2014-01-22",22],["2014-01-23",23],["2014-01-24",24],["2014-01-25",25],["2014-01-26",26],["2014-01-27",27],["2014-01-28",28],["2014-01-29",29],["2014-01-30",30],["2014-01-31",31],["2014-02-01",2],["2014-02-02",20],["2014-02-03",30],["2014-02-04",14],["2014-02-05",15],["2014-02-06",26],["2014-02-07",27],["2014-02-08",38],["2014-02-09",49],["2014-02-10",10],["2014-02-11",11],["2014-02-12",42],["2014-02-13",33],["2014-02-14",134],["2014-02-15",55],["2014-02-16",46],["2014-02-17",47],["2014-02-18",58],["2014-02-19",69],["2014-02-20",40],["2014-02-21",41],["2014-02-22",42],["2014-02-23",43],["2014-02-24",44],["2014-02-25",45],["2014-02-26",66],["2014-02-27",67],["2014-02-28",28],["2014-02-29",29],["2014-03-01",2],["2014-03-02",20],["2014-03-03",30],["2014-03-04",14],["2014-03-05",15],["2014-03-06",26],["2014-03-07",27],["2014-03-08",38],["2014-03-09",49],["2014-03-10",10],["2014-03-11",11],["2014-03-12",42],["2014-03-13",33],["2014-03-14",134],["2014-03-15",55],["2014-03-16",46],["2014-03-17",47],["2014-03-18",58],["2014-03-19",69],["2014-03-20",40],["2014-03-21",41],["2014-03-22",42],["2014-03-23",43],["2014-03-24",44],["2014-03-25",45],["2014-03-26",66],["2014-03-27",67],["2014-03-28",28],["2014-03-29",29],["2014-03-30",30],["2014-03-31",11]],
	                 markPoint : {
	                        data : [
	                            {type : 'max', name: '最大值'},
	                            {type : 'min', name: '最小值'}
	                        ]
	                 },
	                 markLine : {
	                        data : [
	                            {type : 'average', name: '平均值'}
	                        ]
	                 }
	             }
	         ]
	     };
         myChart4.setOption(scatterOption);
        /*散点图 end*/
     },
     initDomainView:function(){//域视图
        var nodes=[
               {name:"核心域",value:"9",id:0,depth:1,category:4},
               {name:"服务域1",value:"6",id:1,depth:2,category:3},
               {name:"服务域2",value:"6",id:2,depth:2,category:3},
               {name:"服务域3",value:"6",id:3,depth:2,category:3},
               {name:"服务域4",value:"6",id:4,depth:2,category:3},
               {name:"服务域5",value:"6",id:5,depth:2,category:3},
               {name:"平台域1",value:"4",id:6,depth:3,category:2},
               {name:"平台域2",value:"4",id:7,depth:3,category:2},
               {name:"平台域3",value:"4",id:8,depth:3,category:2},
               {name:"平台域4",value:"4",id:9,depth:3,category:2},
               {name:"平台域5",value:"4",id:10,depth:3,category:2},
               {name:"平台域6",value:"4",id:11,depth:3,category:2},
               {name:"平台域7",value:"4",id:12,depth:3,category:2},
               {name:"平台域8",value:"4",id:13,depth:3,category:2},
               {name:"平台域9",value:"4",id:14,depth:3,category:2},
               {name:"平台域10",value:"4",id:15,depth:3,category:2},
               {name:"不在线",value:"4",id:16,depth:5,category:0},
               {name:"警告1",value:"4",id:17,depth:4,category:1},
               {name:"警告2",value:"4",id:18,depth:4,category:1},
              ];
        var links=[
                   {source:100,target:0,weight:1},
                   {source:0,target:1,weight:1},
                   {source:0,target:2,weight:1},
                   {source:0,target:3,weight:1},
                   {source:0,target:4,weight:1},
                   {source:0,target:5,weight:1},
                   {source:1,target:6,weight:1},
                   {source:1,target:7,weight:1},
                   {source:2,target:8,weight:1},
                   {source:2,target:9,weight:1},
                   {source:3,target:10,weight:1},
                   {source:3,target:11,weight:1},
                   {source:4,target:12,weight:1},
                   {source:4,target:13,weight:1},
                   {source:5,target:14,weight:1},
                   {source:5,target:15,weight:1},
                   {source:5,target:16,weight:1},
                   {source:4,target:17,weight:1},
                   {source:3,target:18,weight:1}
                  ];

        var forceOption = {
            animation :false,
            animationDuration:1000,
            calculable : false,
            /*
            title : {
                text: 'Force',
                subtext: 'Force-directed tree',
                x:'right',
                y:'bottom'
            },*/
            tooltip : {
                trigger: 'item',
                formatter: '{a} : {b}'
            },
            /*
            legend: {
                x: 'left',
                data:['核心域','服务域', '平台域','告警','不在线']
            },
            */
            series : [
                {
                    type:'force',
                    name : "域视图",
                    categories : [
                      {
                            name: '不在线',
                            itemStyle: {
                                normal: {
                                    color : '#898989'
                                }
                            }
                      },
                      {
                            name: '告警',
                            itemStyle: {
                                normal: {
                                    color : '#ea5514'
                                }
                            }
                        },
                        {
                            name: '平台域',
                            itemStyle: {
                                normal: {
                                    color : '#00a0e9'
                                }
                            }
                        },
                        {
                            name: '服务域',
                            itemStyle: {
                                normal: {
                                    color : '#006934'
                                }
                            }
                        },
                        {
                            name: '核心域',
                            itemStyle: {
                                normal: {
                                    color : '#c30d23'
                                }
                            }
                        }
                    ],
                    itemStyle: {
                        normal: {
                            label: {
                                show: false
                            },
                            nodeStyle : {
                                brushType : 'both',
                                strokeColor : 'rgba(255,215,0,0.6)',
                                lineWidth : 1
                            }
                        }
                    },
                    minRadius : 10,
                    maxRadius : 20,
                    density : 1,
                    attractiveness: 1,
                    nodes : nodes,
                    links : links
                }
            ]
        };
        var myChart3 = echarts.init($('#domain_view_statistics')[0]);
        myChart3.setOption(forceOption);
     },
     initMeetingCharge:function(){//会议比例

        var labelTop = {
            normal : {
                color:"#5eb9ef",
                label : {
                    show : false
                },
                labelLine : {
                    show : false
                }
            }
        };
        var labelBottom = {
            normal : {
                color: '#000000',
                label : {
                    show : false
                },
                labelLine : {
                    show : false
                }
            },
            emphasis: {
                color: 'rgba(0,0,0,0)'
            }
        };

        var radius = [41, 48];//内半径和外半径
        var myChart = echarts.init($('#meeting_scale_statistics')[0]);

        myChart.setOption({

            series : [
                        {
                            type : 'pie',
                            center : ['130px', '64px'],
                            radius : radius,
                            data : [
                                {name:'点对点会议', value:90,itemStyle : labelTop},
                                {name:'多点会议', value:10, itemStyle : labelBottom}
                            ]
                        }
                    ]
        });

     },
     initPlatformCharge:function(){//平台负荷统计
        /*饼图start*/
        var labelTop = {
            normal : {
                color:"#5eb9ef",
                label : {
                    show : true,
                    position : 'center',
                    formatter : function(a,b,c){
                                 return c + '%';
                               },
                    textStyle: {
                        color:'#000000',
                        fontSize:16
                    }
                },
                labelLine : {
                    show : false
                }
            }
        };
        var labelBottom = {
            normal : {
                color: 'rgba(0,0,0,0)',
                label : {
                    show : false
                },
                labelLine : {
                    show : false
                }
            },
            emphasis: {
                color: 'rgba(0,0,0,0)'
            }
        };

        var hideLabelTop = {
            normal : {
                color:"rgba(0,0,0,0)",
                label : {
                    show : false
                },
                labelLine : {
                    show : false
                }
            }
        };
        var hideLabelBottom = {
            normal : {
                color:"#000000",
                label : {
                    show : false
                },
                labelLine : {
                    show : false
                }
            }
        };
     
        var radius = [28, 31];//粗半径--内半径和外半径
        var hideRadius=[28,30];//细半径
        var myChart = echarts.init($('#platform_charge_statistics')[0]);

        myChart.setOption({

            series : [
                        {
                            type : 'pie',
                            center : ['112px', '47px'],
                            radius : hideRadius,
                            data : [
                                {name:'注册', value:54,itemStyle : hideLabelTop},
                                {name:'other', value:46, itemStyle : hideLabelBottom}
                            ]
                        },
                        {
                            type : 'pie',
                            center : ['112px', '47px'],
                            radius : radius,
                            data : [
                                {name:'注册', value:54,itemStyle : labelTop},
                                {name:'other', value:46, itemStyle : labelBottom}
                            ]
                        },
                        {
                            type : 'pie',
                            center : ['244px', '47px'],
                            radius : hideRadius,
                            data : [
                                {name:'媒体资源', value:44,itemStyle : hideLabelTop},
                                {name:'other', value:56, itemStyle : hideLabelBottom}
                            ]
                        },
                        {
                            type : 'pie',
                            center : ['244px', '47px'],
                            radius : radius,
                            data : [
                                {name:'媒体资源', value:44,itemStyle : labelTop},
                                {name:'other', value:56, itemStyle : labelBottom}
                            ]
                        },
                        {
                            type : 'pie',
                            center : ['376px', '47px'],
                            radius : hideRadius,
                            data : [
                                {name:'并发资源', value:35,itemStyle : hideLabelTop},
                                {name:'other', value:65, itemStyle : hideLabelBottom}
                                
                            ]
                        },
                        {
                            type : 'pie',
                            center : ['376px', '47px'],
                            radius : radius,
                            data : [
                                {name:'并发资源', value:35,itemStyle : labelTop},
                                {name:'other', value:65, itemStyle : labelBottom}
                                
                            ]
                        },
                        {
                            type : 'pie',
                            center : ['508px', '47px'],
                            radius : hideRadius,
                            data : [
                                {name:'网口吞吐量', value:30,itemStyle : hideLabelTop},
                                {name:'other', value:70, itemStyle : hideLabelBottom}
                                
                            ]
                        },
                        {
                            type : 'pie',
                            center : ['508px', '47px'],
                            radius : radius,
                            data : [
                                {name:'网口吞吐量', value:30,itemStyle : labelTop},
                                {name:'other', value:70, itemStyle : labelBottom}
                                
                            ]
                        }
                    ]
        });

        /*饼图 end*/
     }
		
};