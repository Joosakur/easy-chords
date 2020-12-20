import React from 'react'
import { H2 } from '../common/typography'

export default function About() {
  return (
    <div>
      <H2>About EasyChords</H2>
      <p className="text-high">
        EasyChords has been created by{' '}
        <a href="https://www.linkedin.com/in/joosa-kurvinen/" className="link">
          Joosa Kurvinen
        </a>
        . Using it is free and it may soon be released as open source.
      </p>
      <p className="text-disabled">
        DISCLAIMER: THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
        PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
        BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
        OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
        DEALINGS IN THE SOFTWARE.
      </p>
    </div>
  )
}
