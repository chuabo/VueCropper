<template>
  <div class="cropper-content">
    <el-row>
      <el-col :span="12">
        <div class="cropper-box">
          <div class="cropper">
            <vue-cropper
                ref="cropper"
                :img="option.img"
                :outputSize="option.outputSize"
                :outputType="option.outputType"
                :info="option.info"
                :canScale="option.canScale"
                :autoCrop="option.autoCrop"
                :autoCropWidth="option.autoCropWidth"
                :autoCropHeight="option.autoCropHeight"
                :fixed="option.fixed"
                :fixedNumber="option.fixedNumber"
                :full="option.full"
                :fixedBox="option.fixedBox"
                :canMove="option.canMove"
                :canMoveBox="option.canMoveBox"
                :original="option.original"
                :centerBox="option.centerBox"
                :height="option.height"
                :infoTrue="option.infoTrue"
                :maxImgSize="option.maxImgSize"
                :enlarge="option.enlarge"
                :mode="option.mode"
                @realTime="realTime"
                @imgLoad="imgLoad">
            </vue-cropper>
          </div>
          <!--底部操作工具按钮-->
          <div class="footer-btn">
            <div class="scope-btn">
              <label class="btn" for="uploads">选择封面</label>
              <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="selectImg($event)">
              <el-button size="mini" type="danger" plain icon="el-icon-zoom-in" @click="changeScale(1)">放大</el-button>
              <el-button size="mini" type="danger" plain icon="el-icon-zoom-out" @click="changeScale(-1)">缩小</el-button>
              <el-button size="mini" type="danger" plain @click="rotateLeftDegree(3)">↺ 左旋转3</el-button>
              <el-button size="mini" type="danger" plain @click="rotateLeft">↺ 左旋转</el-button>
              <el-button size="mini" type="danger" plain @click="rotateRight">↻ 右旋转</el-button>
              <el-button size="mini" type="danger" plain @click="rotateRightDegree(3)">↺ 右旋转3</el-button>
            </div>
            <div class="upload-btn">
              <el-button size="mini" type="success" @click="uploadImg('blob')">上传封面 <i class="el-icon-upload"></i></el-button>
            </div>
            <el-button @click="saveFile">保存</el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <!--预览效果图-->
        <el-row>
          <el-col :span="24">
            <div class="show-preview">
              <div :style="previews.div" class="preview">
                <img id="img" ref="image" :src="previews.url" :style="previews.img">
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
          <div>
            <el-input type="textarea" :rows="10" v-model="ocrData" />
          </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import {VueCropper} from 'vue-cropper'
import {Message} from 'element-ui';

export default {
  name: 'App',
  components: {
    VueCropper
  },
  props: {
  },
  data() {
    return {
      name:this.Name,
      previews: {},
      option:{
        img: '',             //裁剪图片的地址
        outputSize: 1,       //裁剪生成图片的质量(可选0.1 - 1)
        outputType: 'jpeg',  //裁剪生成图片的格式（jpeg || png || webp）
        info: true,          //图片大小信息
        canScale: true,      //图片是否允许滚轮缩放
        //canScale: false,
        autoCrop: true,      //是否默认生成截图框
        autoCropWidth: 230,  //默认生成截图框宽度
        autoCropHeight: 150, //默认生成截图框高度
        //fixed: true,         //是否开启截图框宽高固定比例
        fixed: false,
        fixedNumber: [1.53, 1], //截图框的宽高比例
        full: false,         //false按原比例裁切图片，不失真
        //fixedBox: true,      //固定截图框大小，不允许改变
        fixedBox: false,
        //canMove: false,      //上传图片是否可以移动
        canMove: true,
        canMoveBox: true,    //截图框能否拖动
        //original: false,     //上传图片按照原始比例渲染
        original: true,
        centerBox: false,    //截图框是否被限制在图片里面
        height: true,        //是否按照设备的dpr 输出等比例图片
        infoTrue: false,     //true为展示真实输出图片宽高，false展示看到的截图框宽高
        maxImgSize: 3000,    //限制图片最大宽度和高度
        enlarge: 1,          //图片根据截图框输出比例倍数
        mode: '230px 150px'  //图片默认渲染方式
      },
      rect: {},
      ocrData: ''
    }
  },
  mounted () {
  },
  methods: {
    //初始化函数
    imgLoad (msg) {
      console.log("工具初始化函数====="+msg)
    },
    //图片缩放
    changeScale (num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    //自定义旋转角度
    rotateLeftDegree (deg) {
      this.$refs.cropper.rotate = this.$refs.cropper.rotate + 1/90;
    },
    //向左旋转
    rotateLeft () {
      this.$refs.cropper.rotateLeft()
      //this.$refs.cropper.rotate(10)
    },
    //向右旋转
    rotateRight () {
      this.$refs.cropper.rotateRight()
    },
    rotateRightDegree (deg) {
      this.$refs.cropper.rotate = this.$refs.cropper.rotate - 1/90;
    },
    //实时预览函数
    realTime (data) {
      //console.log(data);
      console.log(data.img.transform);
      this.rect.width = data.div.width.replace('px', '');
      this.rect.height = data.div.height.replace('px', '');
      const trans = data.img.transform.substr(data.img.transform.indexOf('translate3d(')+12);
      this.rect.left = trans.split(',')[0];
      this.rect.right = trans.split(',')[1];
      console.log(this.rect);
      this.previews = data
    },
    //选择图片
    selectImg (e) {
      let file = e.target.files[0]
      if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(e.target.value)) {
        this.$message({
          message: '图片类型要求：jpeg、jpg、png',
          type: "error"
        });
        return false
      }
      //转化为blob
      let reader = new FileReader()
      reader.onload = (e) => {
        let data
        if (typeof e.target.result === 'object') {
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }
        this.option.img = data
      }
      //转化为base64
      reader.readAsDataURL(file)
    },
    //上传图片
    uploadImg (type) {
      let _this = this;
      if (type === 'blob') {
        //获取截图的blob数据
        //this.$refs.cropper.getCropBlob(async (data) => {
        this.$refs.cropper.getCropData(async (data) => {
          //const reader = new FileReader();
          //reader.onload = (e) => {
          //  this.downloadFileByBase64(e.target.result, 'cropImg')
          //}

          let formData = new FormData();
          //formData.append('file',data,"DX.jpg")
          //调用axios上传
          //let {data: res} = await _this.$http.post('/api/file/imgUpload', formData)
          //formData.append('image',data,"DX.jpg")
          const params = {
            "image": data.split(',')[1]
          }
          //let {data: res} = await _this.$http.post('http://localhost:5000/WebAPI/PaddleOCR', params)
          let res = await _this.$http.post('http://localhost:5000/WebAPI/PaddleOCR', params)
          //if(res.code === 200){
          if(res.status === 200){
            _this.$message({
              message: res.statusText,
              type: "success"
            });
            //let data = res.data.replace('[','').replace(']','').split(',');
            //let imgInfo = {
            //  name : _this.Name,
            //  url : data[0]
            //};
            //_this.$emit('uploadImgSuccess',imgInfo);
            console.log(JSON.stringify(res.data));
            this.ocrData = JSON.stringify(res.data);
          }else {
            _this.$message({
              message: '文件服务异常，请联系管理员！',
              type: "error"
            });
          }
        })
      }
    },
    saveFile() {
      const self = this;
      console.log(this.$refs.cropper)
      //this.downloadFileByBase64(this.$refs.cropper.imgs, 'cropImg')

      //this.downloadFileByBase64(this.$refs.image.src, 'cropImg')
      //this.$refs.cropper.getCropBlob(async (data) => {
      //  console.log(data);
      //  this.downloadFileByBase64(data, 'cropImg')
      //})

      //const url = this.$refs.cropper.getCropCanvas().toDataURL();
      //console.log(url);
      //return;

      //截取图像
      let timer;
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.onload = onImgLoaded();
      function onImgLoaded() {
        if (timer != null) clearTimeout(timer);
        if (!img.complete) {
          timer = setTimeout(() => {
            onImgLoaded();
          }, 3);
        } else {
          //onPreloadComplete();
          //var newImg = get
          clipImg();
        }
      }
      function clipImg() {
        img.src = document.getElementById('img').src;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.width = self.rect.width;
        ctx.height = self.rect.height;

        var clipCanvas = document.createElement('canvas');
        const clipCtx = clipCanvas.getContext('2d');
        clipCanvas.width = img.width;
        clipCanvas.height = img.height;
        clipCtx.drawImage(img, 0, 0);

        //ctx.drawImage(clipCanvas, self.rect.left, self.rect.right, self.rect.width, self.rect.height,0,0,self.rect.width, self.rect.height);
        ctx.drawImage(clipCanvas, 1000, 1000, self.rect.width, self.rect.height,0,0,self.rect.width, self.rect.height);
        console.log(canvas.toDataURL());
        self.downloadFileByBase64(canvas.toDataURL(), 'cropImg1')
      }
      img.src = document.getElementById('img').src;
      return;
      


      //图片保存
      /*const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        const event = new MouseEvent('click');
        a.download = 'pic';
        a.href = url;
        a.dispatchEvent(event);
      }
      img.src = document.getElementById('img').src;
      return;*/

      //直接获取base64
      this.$refs.cropper.getCropData(data => {
        console.log(data);
        //reader.readAsDataURL(data);
        this.downloadFileByBase64(data, 'cropImg1')
      })

      
      const reader = new FileReader();
      //获取blob数据
      //this.getImageBlob(this.$refs.image.src, function(data) {
      //  reader.readAsDataURL(data);
      //});
      //或使用cropper获取
      this.$refs.cropper.getCropBlob(async (data) => {
        console.log(data);
        reader.readAsDataURL(data);
      })
      reader.onload = (e) => {
        //const img = document.createElement('img');
        //img.src= e.target.result;
        //document.body.appendChild(img);
        this.downloadFileByBase64(e.target.result, 'cropImg')
      }

      //this.downloadFile(this.$refs.image.src, 'cropImg')

      //this.downloadFile(this.$refs.cropper.imgs, 'cropImg')
      //this.downloadFile(this.previews.url, 'cropImg')
    },

    

    //获取图片的Blob值
    getImageBlob(url, cb) {
        var xhr          = new XMLHttpRequest();
        xhr.open("get", url, true);
        xhr.responseType = "blob";
        xhr.onload       = function() {
            if (this.status == 200) {
                if(cb) cb(this.response);
            }
        };
        xhr.send();
    },



    dataURLtoBlob(dataurl) {
      const arr = dataurl.split(',')
      const mime = arr[0]?.match(/:(.*?);/)?.[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      // eslint-disable-next-line no-plusplus
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    },

    downloadFile(url, name = "What's the fuvk") {
      const a = document.createElement('a')
      a.setAttribute('href', url)
      a.setAttribute('download', name)
      a.setAttribute('target', '_blank')
      const clickEvent = document.createEvent('MouseEvents')
      clickEvent.initEvent('click', true, true)
      a.dispatchEvent(clickEvent)
    },

    downloadFileByBase64(base64, name){
      const myBlob = this.dataURLtoBlob(base64)
      const myUrl = URL.createObjectURL(myBlob)
      this.downloadFile(myUrl, name)
    },
  },
  created () {
    //this.loadUser()
  }
}
</script>

<style lang="scss" scoped>
.cropper-content{
  /*display: flex;
  display: -webkit-flex;
  justify-content: flex-end;*/
  .cropper-box{
    flex: 1;
    width: 100%;
    .cropper{
      /*width: auto;
      width: 800px;*/
      width: 100%;
      height: 500px;
    }
  }

  .show-preview{
    flex: 1;
    -webkit-flex: 1;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    .preview{
      overflow: hidden;
      border:1px solid #67c23a;
      background: #cccccc;
    }
  }
}
.footer-btn{
  margin-top: 30px;
  display: flex;
  display: -webkit-flex;
  justify-content: flex-end;
  .scope-btn{
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    padding-right: 10px;
  }
  .upload-btn{
    flex: 1;
    -webkit-flex: 1;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
  }
  .btn {
    outline: none;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    -webkit-transition: .1s;
    transition: .1s;
    font-weight: 500;
    padding: 8px 15px;
    font-size: 12px;
    border-radius: 3px;
    color: #fff;
    background-color: #409EFF;
    border-color: #409EFF;
    margin-right: 10px;
  }
}
</style>
