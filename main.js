'use strict'
const {
    default: makeWASocket,
    DisconnectReason,
    useMultiFileAuthState,
    makeInMemoryStore,
    downloadContentFromMessage,
    jidDecode,
    generateForwardMessageContent,
    generateWAMessageFromContent,
  } = require('@adiwajshing/baileys'),
  fs = require('fs'),
  figlet = require('figlet'),
  lolcatjs = require('lolcatjs'),
  chalk = require('chalk'),
  logg = require('pino'),
  Jimp = require('jimp')
const clui = require('clui'),
  { Spinner } = clui,
  { serialize, fetchJson, getBuffer } = require('./function/func_Server'),
  { nocache, uncache } = require('./function/Chache_Data.js'),
  { welcome_JSON } = require('./function/Data_Location.js'),
  {
    status_Connection,
  } = require('./function/Data_Server_Bot/Status_Connect.js'),
  { Memory_Store } = require('./function/Data_Server_Bot/Memory_Store.js'),
  {
    groupResponse_Welcome,
    groupResponse_Remove,
    groupResponse_Promote,
    groupResponse_Demote,
  } = require('./function/group_Respon.js'),
  {
    imageToWebp,
    videoToWebp,
    writeExifImg,
    writeExifVid,
  } = require('./function/Exif_Write')
const { updateGroup } = require('./function/update_Group')
let setting = JSON.parse(fs.readFileSync('./config.json')),
  session = './' + setting.sessionName + '.json'
function title() {
  console.clear()
  console.log('----------------------------------------------------')
  const _0x5df444 = {
    font: 'Bloody',
    horizontalLayout: 'full',
    verticalLayout: 'full',
    whitespaceBreak: true,
  }
  lolcatjs.fromString(chalk.cyan(figlet.textSync('HilmySakti', _0x5df444)))
  console.log('----------------------------------------------------')
  lolcatjs.fromString('[SERVER STARTED!!!]')
  console.log('----------------------------------------------------')
  lolcatjs.fromString('Recode by HilmySakti\xB9\xB9')
  console.log('----------------------------------------------------')
}
const status = new Spinner(chalk.cyan(' Booting WhatsApp Bot')),
  starting = new Spinner(chalk.cyan(' Preparing After Connect')),
  reconnect = new Spinner(chalk.redBright(' Reconnecting WhatsApp Bot'))
async function skayx() {
  const { state: _0x15cd7c, saveCreds: _0x4d7b1f } =
    await useMultiFileAuthState('./sessions')
  async function _0x7d8526() {
    const _0x4c2625 = makeWASocket({
      printQRInTerminal: true,
      markOnlineOnConnect: false,
      logger: logg({ level: 'silent' }),
      browser: ['Selfbot-Rafly11', 'Safari', '1.0.0'],
      auth: _0x15cd7c,
      generateHighQualityLinkPreview: true,
      patchMessageBeforeSending: (_0x3618fc) => {
        const _0x965e50 = !!(
          _0x3618fc.buttonsMessage ||
          _0x3618fc.templateMessage ||
          _0x3618fc.listMessage
        )
        if (_0x965e50) {
          const _0x5aad20 = {
            deviceListMetadataVersion: 2,
            deviceListMetadata: {},
          }
          _0x3618fc = {
            viewOnceMessage: {
              message: {
                messageContextInfo: _0x5aad20,
                ..._0x3618fc,
              },
            },
          }
        }
        return _0x3618fc
      },
    })
    title()
    Memory_Store.bind(_0x4c2625.ev)
    _0x4c2625.ev.on('messages.upsert', async (_0x30b954) => {
      var _0x374570 = _0x30b954.messages[0]
      if (!_0x30b954.messages) {
        return
      }
      if (_0x374570.key && _0x374570.key.remoteJid == 'status@broadcast') {
        return
      }
      _0x374570 = serialize(_0x4c2625, _0x374570)
      _0x374570.isBaileys =
        _0x374570.key.id.startsWith('BAE5') ||
        _0x374570.key.id.startsWith('3EB0')
      require('./conn')(_0x4c2625, _0x374570, _0x30b954, setting, Memory_Store)
    })
    _0x4c2625.ev.on('creds.update', _0x4d7b1f)
    _0x4c2625.reply = (_0x474a98, _0x25ebb6, _0x5a0561) =>
      _0x4c2625.sendMessage(
        _0x474a98,
        { text: _0x25ebb6 },
        { quoted: _0x5a0561 }
      )
    _0x4c2625.ev.on('connection.update', (_0x45fa03) => {
      status_Connection(_0x4c2625, _0x45fa03, _0x7d8526)
    })
    _0x4c2625.ev.on('group-participants.update', async (_0x5bfde1) => {
      console.log(_0x5bfde1)
    })
    _0x4c2625.ev.on('group-update', async (_0x1f006) => {
      updateGroup(_0x4c2625, _0x1f006, MessageType)
    })
    _0x4c2625.sendImage = async (
      _0x5a2bc0,
      _0x456683,
      _0x88f708 = '',
      _0x5650a3 = '',
      _0x2d178e
    ) => {
      let _0x495f84 = Buffer.isBuffer(_0x456683)
        ? _0x456683
        : /^data:.*?\/.*?;base64,/i.test(_0x456683)
        ? Buffer.from(_0x456683.split`,`[1], 'base64')
        : /^https?:\/\//.test(_0x456683)
        ? await await getBuffer(_0x456683)
        : fs.existsSync(_0x456683)
        ? fs.readFileSync(_0x456683)
        : Buffer.alloc(0)
      const _0x3498cb = {
          image: _0x495f84,
          caption: _0x88f708,
          ..._0x2d178e,
        },
        _0x292255 = {}
      return (
        (_0x292255.quoted = _0x5650a3),
        await _0x4c2625.sendMessage(_0x5a2bc0, _0x3498cb, _0x292255)
      )
    }
    _0x4c2625.decodeJid = (_0x39a6c1) => {
      if (!_0x39a6c1) {
        return _0x39a6c1
      }
      if (/:\d+@/gi.test(_0x39a6c1)) {
        let _0x399a40 = jidDecode(_0x39a6c1) || {}
        return (
          (_0x399a40.user &&
            _0x399a40.server &&
            _0x399a40.user + '@' + _0x399a40.server) ||
          _0x39a6c1
        )
      } else {
        return _0x39a6c1
      }
    }
    _0x4c2625.generateProfilePicture = async (_0x272314) => {
      const _0x2b6a29 = await Jimp.read(_0x272314),
        _0x52c087 = _0x2b6a29.getWidth(),
        _0x2d820d = _0x2b6a29.getHeight(),
        _0x48a695 = _0x2b6a29.crop(0, 0, _0x52c087, _0x2d820d)
      return {
        img: await _0x48a695
          .scaleToFit(720, 720)
          .getBufferAsync(Jimp.MIME_JPEG),
        preview: await _0x48a695
          .scaleToFit(720, 720)
          .getBufferAsync(Jimp.MIME_JPEG),
      }
    }
    _0x4c2625.downloadAndSaveMediaMessage = async (
      _0x5df6d1,
      _0x2592e0,
      _0x61ea00
    ) => {
      if (_0x2592e0 === 'image') {
        var _0x1334e0 = await downloadContentFromMessage(
          _0x5df6d1.message.imageMessage ||
            _0x5df6d1.message.extendedTextMessage?.contextInfo.quotedMessage
              .imageMessage,
          'image'
        )
        let _0x4a651e = Buffer.from([])
        for await (const _0x233677 of _0x1334e0) {
          _0x4a651e = Buffer.concat([_0x4a651e, _0x233677])
        }
        return fs.writeFileSync(_0x61ea00, _0x4a651e), _0x61ea00
      } else {
        if (_0x2592e0 === 'video') {
          var _0x1334e0 = await downloadContentFromMessage(
            _0x5df6d1.message.videoMessage ||
              _0x5df6d1.message.extendedTextMessage?.contextInfo.quotedMessage
                .videoMessage,
            'video'
          )
          let _0x7a4140 = Buffer.from([])
          for await (const _0x3f470f of _0x1334e0) {
            _0x7a4140 = Buffer.concat([_0x7a4140, _0x3f470f])
          }
          return fs.writeFileSync(_0x61ea00, _0x7a4140), _0x61ea00
        } else {
          if (_0x2592e0 === 'sticker') {
            var _0x1334e0 = await downloadContentFromMessage(
              _0x5df6d1.message.stickerMessage ||
                _0x5df6d1.message.extendedTextMessage?.contextInfo.quotedMessage
                  .stickerMessage,
              'sticker'
            )
            let _0x2ac813 = Buffer.from([])
            for await (const _0x5e2a07 of _0x1334e0) {
              _0x2ac813 = Buffer.concat([_0x2ac813, _0x5e2a07])
            }
            return fs.writeFileSync(_0x61ea00, _0x2ac813), _0x61ea00
          } else {
            if (_0x2592e0 === 'audio') {
              var _0x1334e0 = await downloadContentFromMessage(
                _0x5df6d1.message.audioMessage ||
                  _0x5df6d1.message.extendedTextMessage?.contextInfo
                    .quotedMessage.audioMessage,
                'audio'
              )
              let _0x3d4388 = Buffer.from([])
              for await (const _0x125bcf of _0x1334e0) {
                _0x3d4388 = Buffer.concat([_0x3d4388, _0x125bcf])
              }
              return fs.writeFileSync(_0x61ea00, _0x3d4388), _0x61ea00
            }
          }
        }
      }
    }
    _0x4c2625.sendImageAsSticker = async (
      _0x4f97b6,
      _0x2108d9,
      _0x136626,
      _0x200e8c = {}
    ) => {
      let _0x3908fa = Buffer.isBuffer(_0x2108d9)
          ? _0x2108d9
          : /^data:.*?\/.*?;base64,/i.test(_0x2108d9)
          ? Buffer.from(_0x2108d9.split`,`[1], 'base64')
          : /^https?:\/\//.test(_0x2108d9)
          ? await await getBuffer(_0x2108d9)
          : fs.existsSync(_0x2108d9)
          ? fs.readFileSync(_0x2108d9)
          : Buffer.alloc(0),
        _0x2077b0
      _0x200e8c && (_0x200e8c.packname || _0x200e8c.author)
        ? (_0x2077b0 = await writeExifImg(_0x3908fa, _0x200e8c))
        : (_0x2077b0 = await imageToWebp(_0x3908fa))
      const _0x32ee4f = { url: _0x2077b0 }
      const _0x253199 = {
          sticker: _0x32ee4f,
          ..._0x200e8c,
        },
        _0x368679 = { quoted: _0x136626 }
      await _0x4c2625
        .sendMessage(_0x4f97b6, _0x253199, _0x368679)
        .then((_0x543e0c) => {
          return fs.unlinkSync(_0x2077b0), _0x543e0c
        })
    }
    return (
      (_0x4c2625.sendVideoAsSticker = async (
        _0x1b2afb,
        _0x1fabd5,
        _0x2f2994,
        _0x4f5a28 = {}
      ) => {
        let _0x30ae46 = Buffer.isBuffer(_0x1fabd5)
          ? _0x1fabd5
          : /^data:.*?\/.*?;base64,/i.test(_0x1fabd5)
          ? Buffer.from(_0x1fabd5.split`,`[1], 'base64')
          : /^https?:\/\//.test(_0x1fabd5)
          ? await await getBuffer(_0x1fabd5)
          : fs.existsSync(_0x1fabd5)
          ? fs.readFileSync(_0x1fabd5)
          : Buffer.alloc(0)
        let _0x26344b
        if (_0x4f5a28 && (_0x4f5a28.packname || _0x4f5a28.author)) {
          _0x26344b = await writeExifVid(_0x30ae46, _0x4f5a28)
        } else {
          _0x26344b = await videoToWebp(_0x30ae46)
        }
        const _0x391cd3 = { url: _0x26344b }
        const _0x8685ee = {
            sticker: _0x391cd3,
            ..._0x4f5a28,
          },
          _0x42b86e = { quoted: _0x2f2994 }
        await _0x4c2625
          .sendMessage(_0x1b2afb, _0x8685ee, _0x42b86e)
          .then((_0x5e75b1) => {
            return fs.unlinkSync(_0x26344b), _0x5e75b1
          })
      }),
      _0x4c2625
    )
  }
  _0x7d8526()
}
skayx()
