<!-- 本示例未包含完整css，获取外链css请参考上文，在hello uni-app项目中查看 -->
<template>
	<view>
		<view>
			<view class="play-button-area">
				<image class="icon-play" :src="startImage" @click="startTask"></image>
			</view>
			<view class="play-button-area">
				<image class="icon-play" :src="stopImage" @click="stopTask"></image>
			</view>

			<!-- 				<view class="uni-form-item uni-column">
					<view class="title">报警音量控制</view>
					<slider value="5" min='1' max='10' name="slider" show-value></slider>
				</view> -->

			<!-- 				<view class="uni-list-cell uni-list-cell-pd">
						<view class="uni-list-cell-db">是否开启震动</view>
						<switch name="vibrate" @change="swithchvibrate" />
				</view> -->


			<form @submit="formSubmit" @reset="formReset">
				<view class="uni-form-item uni-column">
					<view class="title">服务器地址:端口:/id=自定义字符串</view>
					<input class="uni-input" name="input" v-model="url" placeholder={{url}} />
				</view>
				<view class="uni-btn-v">
					<view></view>
					<button type="primary" style="margin:30px" form-type="submit">Submit</button>
				</view>
			</form>
		</view>
	</view>
</template>

<script>	
	var httpurl = ''
	uni.getStorage({
		key: 'HTTPURL',
		success: function(res) {
			httpurl = res.data
		},
		fail: function(res) {

		}
	});

	export default {
		data() {
			return {
				timer: null, 
				url: httpurl
			}
		},
		computed: {
			startImage() {
				return "/static/play.png"
			},
			stopImage() {
				return "/static/stop.png"
			}
		},
		// mounted() {
		// 	window.play = this.play;
		// 	window.neverStop = this.neverStop;
		// },
		methods: {
			formSubmit: function(e) {
				console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
				uni.setStorage({
					key: 'HTTPURL',
					data: e.detail.value.input,
				});
				uni.showToast({
					title: '配置成功',
					duration: 500
				})
				this.startTask();
			},
			formReset: function(e) {
				console.log('清空数据')
			},
			// swithchvibrate() {
			// 	uni.setStorage({
			// 		key: 'vibrate',
			// 		data: 0,
			// 		success: function() {
			// 			uni.showModal({
			// 				title: '提示',
			// 				content: '设置成功',
			// 			});
			// 		}
			// 	});
			// },
			startTask() {
				uni.showToast({
					title: '任务启动',
					duration: 1000
				})
				this.timer = setInterval(() => {
					this.getChart()
				}, 30000);
			},
			stopTask() {
				uni.showToast({
					title: '任务停止',
					duration: 1000
				})
				clearInterval(this.timer);
			},
			getChart() {
				uni.getStorage({
					key: 'HTTPURL',
					success: function(res) {
						// uni.showToast({
						// 	title: '获取配置成功'+res.data,
						// 	duration: 500
						// })
						httpurl = res.data
					},
					fail: function() {
						return
					}
				});
			
				if (httpurl == '') {
					return
				}
			
				uni.request({
					url: httpurl,
					dataType: 'text',
				}).then(res => {
					console.log('request success', res);
					if (res.data === 'bad') {
						uni.vibrateShort({});
						uni.vibrateLong({});
						
						const bgAudioManager = uni.getBackgroundAudioManager();
						// bgAudioManager.title = '致爱丽丝';
						// bgAudioManager.singer = '暂无';
						// bgAudioManager.coverImgUrl = 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/music-a.png';
						bgAudioManager.src = 'https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-hello-uniapp/2cc220e0-c27a-11ea-9dfb-6da8e309e0d8.mp3';
						bgAudioManager.play()
						uni.vibrateShort({});
						uni.vibrateLong({});
					}
			
				}).catch(err => {
					console.log(err)
					uni.showModal({
						content: err.errMsg,
						showCancel: false
					});
			
				});
			}
			
			
			
		}
	}


</script>

<style>
	.uni-form-item .title {
		padding: 20rpx 0;
	}

	.uni-input {
		border: 1px solid rgba(144, 144, 144, 0.25);
		background: rgba(144, 144, 144, 0.075);
		height: 40px;
		border-radius: 5px;
	}
</style>

<style scoped>
	.play-time-area {
		display: flex;
		flex-direction: row;
		margin-top: 20px;
	}

	.duration {
		margin-left: auto;
	}

	.play-button-area {
		display: flex;
		flex-direction: row;
		justify-content: center;
		margin-top: 50px;
	}

	.icon-play {
		width: 60px;
		height: 60px;
	}
</style>