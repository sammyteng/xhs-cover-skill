import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const stylesDir = path.join(__dirname, '..', 'styles');
const assetsStylesDir = path.join(__dirname, '..', 'assets', 'styles');
const inputImage = '/Users/siqiteng/Library/Mobile Documents/com~apple~CloudDocs/agent-skills/xhs-visual-director-skill/assets/covers/cover-vibe-coding.png';
const tempOutputDir = path.join(__dirname, '..', 'temp_previews');

// Create temp directory
fs.mkdirSync(tempOutputDir, { recursive: true });
fs.mkdirSync(assetsStylesDir, { recursive: true });

const styleFiles = fs.readdirSync(stylesDir).filter(f => f.endsWith('.json'));

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Map style to custom test titles for more realistic previews
const styleTitles = {
  'tech-finance-analytical': { title: '大国算力博弈', subtitle: '芯片背后的万亿红利' },
  'geek-workflow-dialog': { title: 'RTK 优化指南', subtitle: '节省90% Token损耗' },
  'ai-avatar-sticker': { title: 'Claude Code教程', subtitle: '60分钟完全通关' },
  'hurricane-adventure': { title: '我们的卫星升空了！', subtitle: '硬核探索全记录' },
  'dark-glow': { title: '普通人破局法则', subtitle: '科技时代的成长心法' },
  'hand-drawn-border': { title: '我的日常碎碎念', subtitle: '今天又是元气满满的一天' },
  'outdoor-handwriting': { title: '向着自由出发', subtitle: '周末露营好去处推荐' },
  'neon-contrast': { title: 'Y2K 穿搭指南', subtitle: '复古辣妹街头风' },
  'multi-layer-layout': { title: '爆款写作公式', subtitle: '零基础也能写出十万加' },
  'study-room-intellectual': { title: '高效阅读秘籍', subtitle: '一年读完50本书的方法' },
  'professional-woman': { title: '女性成长心法', subtitle: '职场人生的下半场开局' },
  'sticker-energy': { title: '超强神器推荐', subtitle: '效率提升300%的宝藏工具' },
  'dashed-decoration': { title: '如何深度思考', subtitle: '摆脱低水平勤奋的步骤' },
  'background-big-text': { title: 'AI 时代生存指南', subtitle: '普通人如何保住饭碗' },
  'thinking-question': { title: '为什么越忙越穷？', subtitle: '财富增长的底层逻辑' },
  'split-screen-tags': { title: '宝藏城市推荐', subtitle: '人均500元玩转川西' },
  'cozy-home': { title: '治愈系居家整理', subtitle: '收纳让空间大一倍的魔法' },
  'workplace-big-text': { title: '打破职场天花板', subtitle: '如何向上管理你的老板' },
  'home-motivation': { title: '自律改变生活', subtitle: '坚持这5个习惯的改变' },
  'yellow-pink-banner': { title: '零食好物清单', subtitle: '无限回购的平价小零食' },
  'pink-yellow-playful': { title: '每日开箱测评', subtitle: '那些风很大的网红产品' },
  'professional-clean': { title: '商业提案秘诀', subtitle: '一页PPT打动投资人的技巧' }
};

async function run() {
  console.log(`🚀 开始批量生成 ${styleFiles.length} 个风格效果图...`);
  
  for (let i = 0; i < styleFiles.length; i++) {
    const file = styleFiles[i];
    const styleId = file.replace('.json', '');
    const { title, subtitle } = styleTitles[styleId] || { title: '爆款封面生成器', subtitle: '小红书排版利器' };
    
    console.log(`\n[${i + 1}/${styleFiles.length}] 正在生成风格: ${styleId} ...`);
    
    const command = `node "${path.join(__dirname, 'generate.mjs')}" \
      --image "${inputImage}" \
      --style "${styleId}" \
      --title "${title}" \
      --subtitle "${subtitle}" \
      --output-dir "${tempOutputDir}" \
      --count 1`;
      
    try {
      execSync(command, { stdio: 'inherit' });
      
      // Find the generated file in tempOutputDir and rename/move to assetsStylesDir
      const files = fs.readdirSync(tempOutputDir);
      if (files.length > 0) {
        const generatedFile = files[0];
        const srcPath = path.join(tempOutputDir, generatedFile);
        const destPath = path.join(assetsStylesDir, `${styleId}.jpg`);
        
        fs.renameSync(srcPath, destPath);
        console.log(`✅ 成功保存预览图: ${destPath}`);
      } else {
        console.error(`❌ 未在临时目录找到生成的文件`);
      }
    } catch (e) {
      console.error(`❌ 风格 ${styleId} 生成失败: ${e.message}`);
    }
    
    // Clean temp output dir
    try {
      const files = fs.readdirSync(tempOutputDir);
      for (const f of files) {
        fs.unlinkSync(path.join(tempOutputDir, f));
      }
    } catch {}
    
    // Sleep 8 seconds to prevent API rate limits
    if (i < styleFiles.length - 1) {
      console.log(`等待 8 秒避免限流...`);
      await sleep(8000);
    }
  }
  
  // Remove tempOutputDir
  try {
    fs.rmdirSync(tempOutputDir);
  } catch {}
  
  console.log('\n🎉 所有效果图生成并整理完毕！');
}

run().catch(console.error);
