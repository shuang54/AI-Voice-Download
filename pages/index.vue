<template>
  <h1 class=" text-lime-500 text-center text-lg">AI-Voice-Download</h1>
  <h2 class=" text-lime-500 text-center text-sm"><a href="https://github.com/shuang54/AI-Voice-Download">GITHUB</a></h2>
  <div class="w-max-[1200px] p-6 pb-20">
    <form class="border-b border-gray-900/10 pb-12 ">
      <div class="space-y-12">
        <div class="grid grid-cols-1 gap-x-8 gap-y-10  pb-6 md:grid-cols-3">
          <div>
            <h2 class="text-base font-semibold leading-7 text-gray-900">
              Setting
            </h2>
            <p class="mt-1 text-sm leading-6 text-gray-600">
              Using ChatGPT API to help you convert text into language.
            </p>
            <div class="mt-4">
              <label for="api-key" class="block text-sm font-medium leading-6 text-gray-900">ChatGPT-KEY<span class="text-red-500" v-if="chatGPTKey==''">*Please enter your key.</span></label>
              <div class="mt-2">
                <input v-model="chatGPTKey" type="password" name="api-key" id="api-key" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="ChatGPT-KEY" aria-describedby="email-description" />
              </div>
              <p class="mt-2 text-sm text-gray-500" id="api-key-description">Only saved locally, not uploaded to the server.</p>
            </div>
            <div class="mt-4">
              <label for="proxy-url" class="block text-sm font-medium leading-6 text-gray-900">PROXY-URL</label>
              <div class="mt-2">
                <input v-model="proxyUrl" type="text" name="proxy-url" id="proxy-url" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="https://www.example.com/v1" aria-describedby="email-description" />
              </div>
              <p class="mt-2 text-sm text-gray-500" id="proxy-url-description">Optional.</p>
            </div>
          </div>

          <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div class="col-span-full">
              <div class="flex justify-between px-2">
                <label for="input-text" class="block text-sm font-medium leading-6 text-gray-900">Input text.</label>
                <div>Count:{{ characters }}</div>
              </div>
              <div class="mt-2">
                <textarea id="input-text" name="input-text" rows="3" v-model="formData.input"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
              </div>
              <p class="mt-3 text-sm leading-6 text-gray-600">
                Enter the text that needs to be converted.<a href="https://platform.openai.com/docs/api-reference/audio/createSpeech" target="_blank">The maximum length is 4096 characters.</a>
              </p>
            </div>

            <div class="sm:col-span-3">
              <label for="voice" class="block text-sm font-medium leading-6 text-gray-900">Voice</label>
              <div class="mt-2">
                <select id="voice" name="voice" autocomplete="voice-name" v-model="formData.voice"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                  <option>alloy</option>
                  <option>echo</option>
                  <option>fable</option>
                  <option>onyx</option>
                  <option>nova</option>
                  <option>shimmer</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-6 flex flex-col items-center justify-center gap-x-12">
        <button type="button" @click="submitForm"
        class=" rounded-md bg-indigo-600 px-12 py-2 text-xl font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        {{ isLoading ? 'Loading...' : 'Submit' }}
      </button>
      <p v-if="err" class="text-red-500 text-sm">Something was wrong.</p>
      </div>
    </form>
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-base font-semibold leading-6 text-gray-900">Audio List</h1>
          <p class="mt-2 text-sm text-gray-700">The table below shows the <strong class="font-semibold text-gray-900">results</strong> of the conversion.</p>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button @click="deleteAudioUrlList()" type="button" class="block rounded-md bg-red-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Delete All</button>
        </div>
      </div>
      <div class="-mx-4 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Audio</th>
              <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Voice</th>
              <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Input</th>
              <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span class="sr-only">Delete</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(plan, planIdx) in audioUrlList" :key="plan.id">
              <td :class="[planIdx === 0 ? '' : 'border-t border-transparent', 'relative py-4 pl-4 pr-3 text-sm sm:pl-6']">
                <div class="font-medium text-gray-900">
                  <audio  :src="plan.audio" controls></audio>
                  <span v-if="plan.isCurrent" class="ml-1 text-indigo-600">(Current Plan)</span>
                </div>
                <div v-if="planIdx !== 0" class="absolute -top-px left-6 right-0 h-px bg-gray-200" />
              </td>
              <td :class="[planIdx === 0 ? '' : 'border-t border-gray-200', 'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell']">{{ plan.voice }}</td>
              <td :class="[planIdx === 0 ? '' : 'border-t border-gray-200', 'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell']">
                <textarea id="input-text" name="input-text" rows="3" v-model="plan.input"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
              
              </td>
              <td :class="[planIdx === 0 ? '' : 'border-t border-transparent', 'relative py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6']">
                <button @click="deleteAudioUrlList(planIdx)" type="button" class="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-red-500 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white" :disabled="plan.isCurrent">
                  Delete<span class="sr-only"></span>
                </button>
                <div v-if="planIdx !== 0" class="absolute -top-px left-0 right-6 h-px bg-gray-200" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
// isLoading
const isLoading = ref(false)
// voice data
const formData = reactive({
  model: 'tts-1',
  input: '',
  voice: 'alloy'
})
// voice result list
const audioUrlList = ref([])

// submit
async function submitForm() {
  if(chatGPTKey.value=='') return alert('Please enter your key')
  if(formData.input == '') return alert('Input is empty')
  if(isLoading.value) return;
  try {
    isLoading.value = true
    const url = proxyUrl.value || 'https://api.openai.com/v1'
    const { data, error, refresh } = await useFetch(`${url}/audio/speech`, {
      method: 'post',
      headers: {
        'Authorization': 'Bearer '+chatGPTKey.value,
        'Content-Type': 'application/json'
      },
      body: formData
    })
    if(error.value != null){
      throw error.value;
    }
    audioUrlList.value.unshift({
      voice:formData.voice,
      input:formData.input,
      audio: URL.createObjectURL(data.value)
    })
  } catch (error) {
    console.error('Error submitting form:', error);
    showError()
  } finally {
    isLoading.value = false
  }
}

const characters = ref(0)
watch(() => formData.input, (newInput) => {
  const inputLength = newInput.length
  characters.value = inputLength
})
const deleteAudioUrlList = (id)=>{
  if(!id){
    audioUrlList.value = []
    return;
  }
  console.log(id)
  audioUrlList.value.splice(id, 1);
}

// chatgpt-key
const chatGPTKey = ref(localStorage.getItem('chatgpt-key') || '')
// proxy-url
const proxyUrl = ref(localStorage.getItem('proxy-url'))
watch(chatGPTKey,(newChatGPTKey)=>{
  localStorage.setItem('chatgpt-key',newChatGPTKey)
})
watch(proxyUrl, (proxyUrl) => {
  localStorage.setItem('proxy-url', proxyUrl)
})
// err
const err = ref(false)
const showError = () => {
  err.value = true;
  setTimeout(() => {
    err.value = false;
  }, 5000); // 5000 毫秒后关闭错误提示
};
</script>
