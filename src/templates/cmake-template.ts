export const cmakeTemplate = `cmake_minimum_required(VERSION {{cmakeVersion}})
project({{projectName}} LANGUAGES {{#each languages}}{{this}} {{/each}})

{{#each targets}}
add_{{kind}}({{name}}
  {{#each sources}}
    {{this}}
  {{/each}}
)
{{#if includeDirs}}
target_include_directories({{name}} PUBLIC
  {{#each includeDirs}}
    {{this}}
  {{/each}}
)
{{/if}}
{{#if linkLibs}}
target_link_libraries({{name}} PUBLIC
  {{#each linkLibs}}
    {{this}}
  {{/each}}
)
{{/if}}
{{#if compileDefs}}
target_compile_definitions({{name}} PUBLIC
  {{#each compileDefs}}
    {{{this}}}
  {{/each}}
)
{{/if}}
{{/each}}

{{#each options}}
add_compile_options({{{this}}})
{{/each}}`