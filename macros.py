"""
MkDocs macros for Strands Agents documentation.

This file defines custom Jinja2 macros that can be used in markdown files.
"""


def define_env(env):
    """
    Define custom macros for the MkDocs environment.
    
    Args:
        env: The MkDocs macros plugin environment
    """
    
    @env.macro
    def ts_not_supported(message="This feature is not supported in TypeScript."):
        """
        Generate an admonition box indicating feature is not supported in TypeScript.
        
        Args:
            message: Custom message to display (default: "This feature is not supported in TypeScript.")
            
        Returns:
            Markdown string with info admonition
            
        Example usage in markdown:
            {{ ts_not_supported() }}
            {{ ts_not_supported("Coming soon in TypeScript") }}
        """
        return f'''!!! info "Not supported in TypeScript"
    {message}
'''
    
    @env.macro
    def ts_not_supported_code(message="Not supported in TypeScript"):
        """
        Generate a TypeScript code tab with a message indicating feature is not supported.
        
        Args:
            message: Custom message to display (default: "Not supported in TypeScript")
            
        Returns:
            Markdown string with TypeScript tab containing the message
            
        Example usage in markdown:
            {{ ts_not_supported_code() }}
            {{ ts_not_supported_code("Coming soon in TypeScript") }}
        """
        return f'''=== "TypeScript"
    ```ts
    // {message}
    ```
'''

    @env.macro
    def experimental_feature_warning(message="This feature is experimental and may change in future versions. Use with caution in production environments."):
        return f'''!!! warning "Experimental Feature"
    {message}
        '''
