# Solana DID - 去中心化身份系统

<div align="center">
  <img src="https://via.placeholder.com/200x200?text=Solana+DID" alt="Solana DID Logo" width="200" height="200">
  <br>
  <h3>基于 Solana 的去中心化身份与域名管理系统</h3>
</div>

## 📖 项目概述

Solana DID 是一个构建在 Solana 区块链上的去中心化身份 (DID) 和域名管理系统。该项目旨在提供用户友好、高效且安全的去中心化身份解决方案，同时支持域名注册、转让和管理功能。

### 核心特性

- **DID 创建与管理**: 在 Solana 上创建和管理去中心化身份
- **域名注册**: 注册并管理以 `.sol` 结尾的域名
- **域名交易**: 支持域名的公开销售和私下转让
- **高性能**: 充分利用 Solana 的高吞吐量和低交易费用
- **安全性**: 采用先进的密码学确保身份和域名的安全

## 🚀 快速开始

### 前提条件

- [Node.js](https://nodejs.org/) (v16+)
- [Rust](https://www.rust-lang.org/) (v1.60+)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools) (v1.10+)
- [Anchor](https://project-serum.github.io/anchor/getting-started/installation.html) (v0.25+)

### 安装

1. 克隆仓库

```bash
git clone https://github.com/yourusername/solana-did.git
cd solana-did
```

2. 安装依赖

```bash
# 安装 Rust 依赖
cd program
cargo build

# 安装 Node.js 依赖
cd ../app
npm install
```

3. 编译程序

```bash
cd ../
anchor build
```

4. 测试程序

```bash
anchor test
```

## 📚 主要功能

### 去中心化身份 (DID)

- **注册 DID**: 用户可以为自己创建去中心化身份
- **更新 DID**: 修改 DID 相关信息
- **解析 DID**: 查询 DID 相关的详细信息
- **验证 DID**: 验证身份所有权

### 域名管理

- **域名注册**: 注册以 `.sol` 结尾的域名
- **域名更新**: 更新域名相关信息
- **域名转让**: 支持域名的转让交易

### 域名交易市场

- **公开销售**: 设置价格并公开销售域名
- **私人转让**: 直接向指定地址转让域名
- **交易取消**: 取消待处理的转让交易

## 🛠️ 技术架构

### 智能合约 (Anchor/Rust)

- **DID 管理合约**: 管理去中心化身份的创建和更新
- **域名注册合约**: 处理域名的注册和管理
- **域名交易合约**: 支持域名的交易流程

## 📋 使用示例

### 注册域名

```typescript
import { Connection, PublicKey } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import { DID_PROGRAM_ID } from "./constants";

async function registerDomain(connection, wallet, domainName) {
  const program = new Program(DID_IDL, DID_PROGRAM_ID, { connection, wallet });
  
  await program.methods
    .register(domainName)
    .accounts({
      signer: wallet.publicKey,
    })
    .rpc();
    
  console.log(`Successfully registered ${domainName}.sol`);
}
```

### 域名转让

```typescript
async function transferDomain(connection, wallet, domainName, newOwner, price) {
  const program = new Program(DID_IDL, DID_PROGRAM_ID, { connection, wallet });
  
  await program.methods
    .initTransfer(domainName, newOwner, price)
    .accounts({
      signer: wallet.publicKey,
    })
    .rpc();
    
  console.log(`Successfully initiated transfer of ${domainName}.sol`);
}
```

## 🔍 未来计划

- **身份验证与授权系统**: 增加更复杂的身份验证机制
- **与 W3C DID 标准兼容**: 确保与全球标准兼容
- **安全与隐私增强**: 实现更强大的安全和隐私保护功能
- **跨链集成**: 支持与其他区块链的互操作性
- **身份数据市场**: 建立安全的身份数据交换平台


## 📄 许可证

本项目采用 [MIT 许可证](./LICENSE) 进行许可。


---

<div align="center">
  <p>
    构建于 <a href="https://solana.com">Solana</a> 之上 | 由 <a href="https://project-serum.github.io/anchor/">Anchor</a> 提供支持
  </p>
</div>
