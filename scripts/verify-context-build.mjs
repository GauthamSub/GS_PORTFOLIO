import { spawn } from 'node:child_process'
import { createInterface } from 'node:readline'
import { join } from 'node:path'

// Use the locally installed context-mode MCP server even when it is not
// registered with the host. Raw build output stays inside ctx_execute.
const server = process.env.CONTEXT_MODE_SERVER || join(process.env.APPDATA, 'npm/node_modules/context-mode/server.mjs')
const child = spawn(process.execPath, [server, '--agent', 'codex'], { cwd: process.cwd(), stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true })
const lines = createInterface({ input: child.stdout })
let stderr = ''
child.stderr.on('data', data => { stderr += data })
const send = message => child.stdin.write(JSON.stringify(message) + '\n')
const timeout = setTimeout(() => { console.error('context-mode verification timed out', stderr.slice(-1000)); child.kill(); process.exitCode = 1 }, 120000)
send({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'portfolio-build-check', version: '1.0' } } })
lines.on('line', line => {
  let message
  try { message = JSON.parse(line) } catch { return }
  if (message.id === 1) {
    send({ jsonrpc: '2.0', method: 'notifications/initialized' })
    send({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'ctx_execute', arguments: {
      language: 'javascript',
      code: "const {spawnSync}=require('node:child_process'); const r=spawnSync('npm.cmd',['run','build'],{shell:true,encoding:'utf8',windowsHide:true}); const output=(r.stdout||'')+(r.stderr||''); console.log('npm run build exit:',r.status); console.log(output.split(/\\r?\\n/).filter(line=>/error|warning|built in|Generated static|chunk.*500|Consider:/.test(line)).join('\\n')); if(r.status!==0){console.log(output.slice(-5000));process.exit(r.status||1)}",
      timeoutMs: 110000,
    } } })
  }
  if (message.id === 2) {
    clearTimeout(timeout)
    for (const content of message.result?.content || []) if (content.type === 'text') console.log(content.text)
    if (message.error || message.result?.isError) { console.error(message.error || 'context-mode build failed'); if (stderr) console.error(stderr.slice(-2000)); process.exitCode = 1 }
    child.kill()
    lines.close()
  }
})
child.on('error', error => { clearTimeout(timeout); console.error(error.message); process.exitCode = 1 })
