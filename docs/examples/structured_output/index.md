Structured output lets you get type-safe, validated responses from language models. Instead of raw text that you need to parse manually, you define the exact structure you want and receive a validated object.

Each language uses its own schema library for defining output structures. See the tabs below for language-specific examples.

## Basic Structured Output

Define a schema and pass it to the agent. The agent returns a validated object matching your schema.

(( tab "Python" ))
```python
from pydantic import BaseModel
from strands import Agent

class PersonInfo(BaseModel):
    name: str
    age: int
    occupation: str

agent = Agent()
result = agent(
    "John Smith is a 30-year-old software engineer",
    structured_output_model=PersonInfo
)

print(f"Name: {result.structured_output.name}")      # "John Smith"
print(f"Age: {result.structured_output.age}")        # 30
print(f"Job: {result.structured_output.occupation}") # "software engineer"
```
(( /tab "Python" ))

(( tab "TypeScript" ))
```typescript
import { Agent } from '@strands-agents/sdk'
import { z } from 'zod'

const PersonInfo = z.object({
  name: z.string().describe('Name of the person'),
  age: z.number().describe('Age of the person'),
  occupation: z.string().describe('Occupation of the person'),
})

type PersonInfo = z.infer<typeof PersonInfo>

const basicAgent = new Agent()
const basicResult = await basicAgent.invoke('John Smith is a 30-year-old software engineer', {
  structuredOutputSchema: PersonInfo,
})

const person = basicResult.structuredOutput as PersonInfo
console.log(`Name: ${person.name}`) // "John Smith"
console.log(`Age: ${person.age}`) // 30
console.log(`Job: ${person.occupation}`) // "software engineer"
```
(( /tab "TypeScript" ))

## Complex Nested Schemas

Schemas can be nested to represent complex data structures:

(( tab "Python" ))
```python
from typing import List, Optional
from pydantic import BaseModel, Field
from strands import Agent

class Address(BaseModel):
    street: str
    city: str
    country: str
    postal_code: Optional[str] = None

class Contact(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None

class Person(BaseModel):
    name: str = Field(description="Full name of the person")
    age: int = Field(description="Age in years")
    address: Address = Field(description="Home address")
    contacts: List[Contact] = Field(default_factory=list, description="Contact methods")
    skills: List[str] = Field(default_factory=list, description="Professional skills")

agent = Agent()
result = agent(
    "Extract info: Jane Doe, a systems admin, 28, lives at 123 Main St, New York, USA. Email: jane@example.com",
    structured_output_model=Person
)

print(f"Name: {result.structured_output.name}")
print(f"Age: {result.structured_output.age}")
print(f"Street: {result.structured_output.address.street}")
print(f"City: {result.structured_output.address.city}")
print(f"Email: {result.structured_output.contacts[0].email}")
```
(( /tab "Python" ))

(( tab "TypeScript" ))
```typescript
import { Agent } from '@strands-agents/sdk'
import { z } from 'zod'

const Address = z.object({
  street: z.string(),
  city: z.string(),
  country: z.string(),
  postalCode: z.string().optional(),
})

const Contact = z.object({
  email: z.string().optional(),
  phone: z.string().optional(),
})

const Person = z.object({
  name: z.string().describe('Full name of the person'),
  age: z.number().describe('Age in years'),
  address: Address.describe('Home address'),
  contacts: z.array(Contact).describe('Contact methods'),
  skills: z.array(z.string()).describe('Professional skills'),
})

type Person = z.infer<typeof Person>

const agent = new Agent()
const result = await agent.invoke(
  'Extract info: Jane Doe, a systems admin, 28, lives at 123 Main St, New York, USA. Email: jane@example.com',
  { structuredOutputSchema: Person },
)

const person = result.structuredOutput as Person
console.log(`Name: ${person.name}`) // "Jane Doe"
console.log(`Age: ${person.age}`) // 28
console.log(`Street: ${person.address.street}`) // "123 Main St"
console.log(`City: ${person.address.city}`) // "New York"
console.log(`Email: ${person.contacts[0].email}`) // "jane@example.com"
```
(( /tab "TypeScript" ))

## How It Works

1.  Define a schema using your language’s schema library
2.  Pass the schema to the agent when invoking it
3.  Access the validated output from the result

The agent converts your schema into a tool specification that guides the language model to produce correctly formatted responses, then validates the output automatically.

## Learn More

For more details, see the [Structured Output documentation](/docs/user-guide/concepts/agents/structured-output/index.md).