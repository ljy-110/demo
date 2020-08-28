<template>
  <div>
    <div class="container">
    <div class="box">
      <div class="seach" style="margin: 15px 0 20px 0;">
        <span style="margin-right:1%;font-size:30px;line-height:50px;letter-spacing:5px">AI探针</span>
        <el-input placeholder="请输入内容" v-model="input" clearable class="input-with-select"></el-input>
        <el-button v-if="!loading" @click="seachData">训练模型</el-button>
        <el-button v-else @click="seachData" :loading="loading" style="background-color: #ccc;">正在训练</el-button>
      </div>
      <el-table :data="tableData"  :header-cell-style="tableHeaderColor" :height="tableHeight" style="width:100%" stripe border>
        <el-table-column prop="nickname" label="昵称" width="150%" align="center"></el-table-column>
        <el-table-column prop="account" label="账号" width="150%" align="center"></el-table-column>
        <el-table-column prop="praiseNum" label="点赞数" width="150%" align="center"></el-table-column>
        <!-- <el-table-column prop="followNum" label="关注数" width="150%" align="center"></el-table-column> -->
        <el-table-column prop="fanNum" label="粉丝数" width="150%" align="center"></el-table-column>
        <el-table-column prop="workNum" label="作品数" width="150%" align="center"></el-table-column>
        <el-table-column prop="dynamicNum" label="动态数" width="150%" align="center"></el-table-column>
        <el-table-column label="内容" width="150%" align="center">
          <template slot-scope="scope">
            <a :title="scope.row.description" class="seetext" @click="seeText(scope.row.description)">{{scope.row.description}}</a>
            
          </template>
        </el-table-column>
        <el-table-column prop="time" label="时间" width="150%" align="center"></el-table-column>
        <el-table-column prop="source" label="来源" width="150%" align="center"></el-table-column>
        
      </el-table>
      <div class="text" v-if="dialogVisible">
        <i @click="guanbi" class="el-icon-close tb"></i>
        <p style="text-align: center;">内容</p>
        <div style="font-size:16px;text-align: left;">{{description}}</div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      tableHeight: window.innerHeight * 0.9,
      timer: null,
      input: '',
      loading: false,
      ress :'',
      dialogVisible: false,
      description:'',
      time:null
    };
  },
  methods: {
    // 获取接口数据
    async getTableData() {
      const { data: res } = await this.$axios.get("/cs/select/fashion/data");
      this.tableData = res.data;
      console.log(res);
    },
    // 修改table header的背景色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color: #696969;color: #fff;font-weight: 500;font-size: 16px;'
      }
    },
    async seachData(){
      this.loading = true
      let seachdata = this.input
      console.log(seachdata)
      if(!seachdata){
        this.$message.error('输入框不能为空');
        this.loading = false
        return
      }else{
        let that = this
      that.$axios({
        method: 'get',
        url: `http://192.168.101.141:8080/cs/public/train/fashion/model?text=`+seachdata,
        // headers:{'Content-Type': 'multipart/form-data'},
        data: seachdata
        }).then(async(res) => {
          console.log(res)
        if(res.status === 200){
          this.setTimer()
          localStorage.setItem('status',res.status)
        }else{
          console.log('error')
        }
      })
      }
      
    },
    async taskAvt(){
        const { data: ress } = await this.$axios.get("/cs/select/task");
        let data = ress
        console.log(ress)
        if(data.status === 301){
          console.log('没有完成')
        }else if(data.status === 200){
          this.loading = false
          this.clearTime()
          this.$message.success('任务已完成');
          this.input=''
        }else{
          console.log('error')
        }
    },
    seeText(text){
      this.dialogVisible=true
      this.description = text
    },
    guanbi(){
      this.dialogVisible=false
    },
    clearTime(){
      clearInterval(this.time);
      // this.time = null;
    },
    setTimer() {
　　　　this.time = setInterval( () => {
          this.taskAvt();
　　　　}, 3000);
　　},

  },
  mounted() {
    // 每隔3秒钟获取接口数据，定时刷新页面来达到效果
    this.getTableData();
    this.timer = setInterval(() => {
      setTimeout(this.getTableData, 0);
    }, 5000);
    let rest = localStorage.getItem('status')
  },
  created() {
    this.getTableData();
  },
  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.time);
    this.timer = null;
    this.time = null;
  }
};
</script>

<style lang="less" scoped>
@color: #e2e6eb;
.container {
  background: @color;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.box {
  position: absolute;
  height: 100%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.seach{
  display: flex;
  width: 100%;
  justify-content: center;
}
/deep/ .el-input {
  width: 68%;
  height: 50px;
}
/deep/ .el-input input{
    height: 50px;
}

/deep/ .el-input__inner:focus{
  border: 1px solid #ccc;
}
/deep/ .el-button{
  height: 50px;
  width: 10%;
  background-color: #108CEE;
  color: white;
}
.seetext{
  width:100%;
  height:50px;
  cursor:pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  // white-space: nowrap;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  display: -webkit-box;
}
.text{
  position: absolute;
  top: 20%;
  left: 40%;
  z-index: 200000000;
  width: 30%;
  height: 200px;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
.text p{
  font-size: 18px;
  margin-bottom: 10px;
}
.tb{
  float: right;
  font-size: 16px;
  cursor:pointer;
}
</style>